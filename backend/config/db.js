//testing
import { Admin } from './admin';
import { type BSONSerializeOptions, type Document, resolveBSONOptions } from './bson';
import { ChangeStream, type ChangeStreamDocument, type ChangeStreamOptions } from './change_stream';
import { Collection, type CollectionOptions } from './collection';
import * as CONSTANTS from './constants';
import { AggregationCursor } from './cursor/aggregation_cursor';
import { ListCollectionsCursor } from './cursor/list_collections_cursor';
import { RunCommandCursor, type RunCursorCommandOptions } from './cursor/run_command_cursor';
import { MongoInvalidArgumentError } from './error';
import type { MongoClient, PkFactory } from './mongo_client';
import type { Abortable, TODO_NODE_3286 } from './mongo_types';
import type { AggregateOptions } from './operations/aggregate';
import { type CreateCollectionOptions, createCollections } from './operations/create_collection';
import {
  type DropCollectionOptions,
  dropCollections,
  DropDatabaseOperation,
  type DropDatabaseOptions
} from './operations/drop';
import { executeOperation } from './operations/execute_operation';
import {
  CreateIndexesOperation,
  type CreateIndexesOptions,
  type IndexDescriptionCompact,
  type IndexDescriptionInfo,
  type IndexInformationOptions,
  type IndexSpecification
} from './operations/indexes';
import type { CollectionInfo, ListCollectionsOptions } from './operations/list_collections';
import { ProfilingLevelOperation, type ProfilingLevelOptions } from './operations/profiling_level';
import { RemoveUserOperation, type RemoveUserOptions } from './operations/remove_user';
import { RenameOperation, type RenameOptions } from './operations/rename';
import { RunCommandOperation, type RunCommandOptions } from './operations/run_command';
import {
  type ProfilingLevel,
  SetProfilingLevelOperation,
  type SetProfilingLevelOptions
} from './operations/set_profiling_level';
import { DbStatsOperation, type DbStatsOptions } from './operations/stats';
import { ReadConcern } from './read_concern';
import { ReadPreference, type ReadPreferenceLike } from './read_preference';
import { DEFAULT_PK_FACTORY, filterOptions, MongoDBNamespace, resolveOptions } from './utils';
import { WriteConcern, type WriteConcernOptions } from './write_concern';

// Allowed parameters for database configuration
const DB_OPTIONS_ALLOW_LIST = [
  'writeConcern',
  'readPreference',
  'readPreferenceTags',
  'native_parser',
  'forceServerObjectId',
  'pkFactory',
  'serializeFunctions',
  'raw',
  'authSource',
  'ignoreUndefined',
  'readConcern',
  'retryMiliSeconds',
  'numberOfRetries',
  'useBigInt64',
  'promoteBuffers',
  'promoteLongs',
  'bsonRegExp',
  'enableUtf8Validation',
  'promoteValues',
  'compression',
  'retryWrites',
  'timeoutMS'
];

/** @internal */
export interface DbPrivate {
  options?: DbOptions;
  readPreference?: ReadPreference;
  pkFactory: PkFactory;
  readConcern?: ReadConcern;
  bsonOptions: BSONSerializeOptions;
  writeConcern?: WriteConcern;
  namespace: MongoDBNamespace;
}

/** @public */
export interface DbOptions extends BSONSerializeOptions, WriteConcernOptions {
  authSource?: string;
  forceServerObjectId?: boolean;
  readPreference?: ReadPreferenceLike;
  pkFactory?: PkFactory;
  readConcern?: ReadConcern;
  retryWrites?: boolean;
  /** Specifies the time an operation will run until it throws a timeout error */
  timeoutMS?: number;
}

/**
 * The **Db** class represents a MongoDB Database.
 */
export class Db {
  /** @internal */
  s: DbPrivate;

  /** Gets the MongoClient associated with the Db. */
  readonly client: MongoClient;

  public static SYSTEM_NAMESPACE_COLLECTION = CONSTANTS.SYSTEM_NAMESPACE_COLLECTION;
  public static SYSTEM_INDEX_COLLECTION = CONSTANTS.SYSTEM_INDEX_COLLECTION;
  public static SYSTEM_PROFILE_COLLECTION = CONSTANTS.SYSTEM_PROFILE_COLLECTION;
  public static SYSTEM_USER_COLLECTION = CONSTANTS.SYSTEM_USER_COLLECTION;
  public static SYSTEM_COMMAND_COLLECTION = CONSTANTS.SYSTEM_COMMAND_COLLECTION;
  public static SYSTEM_JS_COLLECTION = CONSTANTS.SYSTEM_JS_COLLECTION;

  /**
   * Creates a new Db instance.
   */
  constructor(client: MongoClient, databaseName: string, options?: DbOptions) {
    options = options ?? {};
    options = filterOptions(options, DB_OPTIONS_ALLOW_LIST);

    if (typeof databaseName === 'string' && databaseName.includes('.')) {
      throw new MongoInvalidArgumentError(`Database names cannot contain the character '.'`);
    }

    this.s = {
      options,
      readPreference: ReadPreference.fromOptions(options),
      bsonOptions: resolveBSONOptions(options, client),
      pkFactory: options?.pkFactory ?? DEFAULT_PK_FACTORY,
      readConcern: ReadConcern.fromOptions(options),
      writeConcern: WriteConcern.fromOptions(options),
      namespace: new MongoDBNamespace(databaseName)
    };

    this.client = client;
  }

  get databaseName(): string {
    return this.s.namespace.db;
  }

  get options(): DbOptions | undefined {
    return this.s.options;
  }

  get secondaryOk(): boolean {
    return this.s.readPreference?.preference !== 'primary' || false;
  }

  get readConcern(): ReadConcern | undefined {
    return this.s.readConcern;
  }

  get readPreference(): ReadPreference {
    return this.s.readPreference ?? this.client.readPreference;
  }

  get bsonOptions(): BSONSerializeOptions {
    return this.s.bsonOptions;
  }

  get writeConcern(): WriteConcern | undefined {
    return this.s.writeConcern;
  }

  get namespace(): string {
    return this.s.namespace.toString();
  }

  public get timeoutMS(): number | undefined {
    return this.s.options?.timeoutMS;
  }

  /**
   * Create a new collection on a server.
   */
  async createCollection<TSchema extends Document = Document>(
    name: string,
    options?: CreateCollectionOptions
  ): Promise<Collection<TSchema>> {
    options = resolveOptions(this, options);
    return await createCollections<TSchema>(this, name, options);
  }

  /**
   * Execute a command against the database.
   */
  async command(command: Document, options?: RunCommandOptions & Abortable): Promise<Document> {
    return await executeOperation(
      this.client,
      new RunCommandOperation(
        this.s.namespace,
        command,
        resolveOptions(undefined, {
          ...resolveBSONOptions(options),
          timeoutMS: options?.timeoutMS ?? this.timeoutMS,
          session: options?.session,
          readPreference: options?.readPreference,
          signal: options?.signal
        })
      )
    );
  }

  /**
   * Execute an aggregation framework pipeline.
   */
  aggregate<T extends Document = Document>(
    pipeline: Document[] = [],
    options?: AggregateOptions
  ): AggregationCursor<T> {
    return new AggregationCursor(
      this.client,
      this.s.namespace,
      pipeline,
      resolveOptions(this, options)
    );
  }

  /** Return the Admin db instance */
  admin(): Admin {
    return new Admin(this);
  }

  /**
   * Returns a reference to a MongoDB Collection.
   */
  collection<TSchema extends Document = Document>(
    name: string,
    options: CollectionOptions = {}
  ): Collection<TSchema> {
    if (typeof options === 'function') {
      throw new MongoInvalidArgumentError('The callback form of this helper has been removed.');
    }
    return new Collection<TSchema>(this, name, resolveOptions(this, options));
  }

  /** Get all database statistics. */
  async stats(options?: DbStatsOptions): Promise<Document> {
    return await executeOperation(
      this.client,
      new DbStatsOperation(this, resolveOptions(this, options))
    );
  }

  /** List collections with optional filters. */
  listCollections<
    T extends Pick<CollectionInfo, 'name' | 'type'> | CollectionInfo =
      | Pick<CollectionInfo, 'name' | 'type'>
      | CollectionInfo
  >(
    filter: Document = {},
    options: ListCollectionsOptions & Abortable = {}
  ): ListCollectionsCursor<T> {
    return new ListCollectionsCursor<T>(this, filter, resolveOptions(this, options));
  }

  /** Rename a collection. */
  async renameCollection<TSchema extends Document = Document>(
    fromCollection: string,
    toCollection: string,
    options?: RenameOptions
  ): Promise<Collection<TSchema>> {
    return await executeOperation(
      this.client,
      new RenameOperation(
        this.collection<TSchema>(fromCollection) as TODO_NODE_3286,
        toCollection,
        resolveOptions(undefined, {
          ...options,
          readPreference: ReadPreference.primary
        })
      ) as TODO_NODE_3286
    );
  }

  /** Drop a collection from the database. */
  async dropCollection(name: string, options?: DropCollectionOptions): Promise<boolean> {
    options = resolveOptions(this, options);
    return await dropCollections(this, name, options);
  }

  /** Drop the entire database. */
  async dropDatabase(options?: DropDatabaseOptions): Promise<boolean> {
    return await executeOperation(
      this.client,
      new DropDatabaseOperation(this, resolveOptions(this, options))
    );
  }

  /** Fetch all valid collections for the current db. */
  async collections(options?: ListCollectionsOptions): Promise<Collection[]> {
    options = resolveOptions(this, options);
    const collections = await this.listCollections({}, { ...options, nameOnly: true }).toArray();

    return collections
      .filter(({ name }) => !name.includes('$'))
      .map(({ name }) => new Collection(this, name, this.s.options));
  }

  /** Create an index on the specified collection. */
  async createIndex(
    name: string,
    indexSpec: IndexSpecification,
    options?: CreateIndexesOptions
  ): Promise<string> {
    const indexes = await executeOperation(
      this.client,
      CreateIndexesOperation.fromIndexSpecification(this, name, indexSpec, options)
    );
    return indexes[0];
  }

  /** Remove a user from the database. */
  async removeUser(username: string, options?: RemoveUserOptions): Promise<boolean> {
    return await executeOperation(
      this.client,
      new RemoveUserOperation(this, username, resolveOptions(this, options))
    );
  }

  /** Set the MongoDB profiling level. */
  async setProfilingLevel(
    level: ProfilingLevel,
    options?: SetProfilingLevelOptions
  ): Promise<ProfilingLevel> {
    return await executeOperation(
      this.client,
      new SetProfilingLevelOperation(this, level, resolveOptions(this, options))
    );
  }

  /** Retrieve the current MongoDB profiling level. */
  async profilingLevel(options?: ProfilingLevelOptions): Promise<string> {
    return await executeOperation(
      this.client,
      new ProfilingLevelOperation(this, resolveOptions(this, options))
    );
  }

  /** Retrieve index information for a collection. */
  async indexInformation(
    name: string,
    options?: IndexInformationOptions
  ): Promise<IndexDescriptionCompact | IndexDescriptionInfo[]> {
    return await this.collection(name).indexInformation(resolveOptions(this, options));
  }

  /** Create a new Change Stream for the database. */
  watch<
    TSchema extends Document = Document,
    TChange extends Document = ChangeStreamDocument<TSchema>
  >(pipeline: Document[] = [], options: ChangeStreamOptions = {}): ChangeStream<TSchema, TChange> {
    if (!Array.isArray(pipeline)) {
      options = pipeline;
      pipeline = [];
    }
    return new ChangeStream<TSchema, TChange>(this, pipeline, resolveOptions(this, options));
  }

  /** A low-level cursor API for running commands. */
  runCursorCommand(command: Document, options?: RunCursorCommandOptions): RunCommandCursor {
    return new RunCommandCursor(this, command, options);
  }
}
