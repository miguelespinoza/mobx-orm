// Copyright (c) 2017-2020 AppJudo Inc.  MIT License.

import { action, computed, observable } from 'mobx';

import Repository from './Repository';
import { Id, ModelObject } from './types';

interface UpdateOptions<T extends Model<T>> {
  repository?: Repository<T>;
}

class ModelOrmData<T extends Model<T>> {
  @observable isLoading: boolean = false;
  @observable isReloading: boolean = false;
  @observable loadingPromise?: Promise<T | undefined>;

  @observable isSaving: boolean = false;
  @observable savingPromise?: Promise<T | undefined>;

  @observable repository?: Repository<T>;

  // Deprecated.
  @computed get promise() {
    return this.loadingPromise;
  }
}

export default abstract class Model<T extends Model<T>> {
  @observable id?: Id;
  @observable _orm: ModelOrmData<T>;

  constructor() {
    this._orm = new ModelOrmData();
  }

  /* eslint-disable-next-line class-methods-use-this */
  get isFullyLoaded(): boolean {
    return true;
  }

  @action update(values: Partial<T> = {}, options: UpdateOptions<T> = {}) {
    const repository = options.repository || this._orm.repository;
    if (!repository) {
      throw new Error('Model `update` method called without repository');
    }
    const item = this as unknown as T;
    const itemId = item[repository.idKey];
    if (!itemId) {
      throw new Error(`Model \`update\` requires \`${repository.idKey}\` to be already set`);
    }
    return repository.update(item, values);
  }

  @action save(repository?: Repository<T>) {
    if (!repository) repository = this._orm.repository;
    if (!repository) {
      throw new Error('Model `save` method called without repository');
    }
    const {idKey} = repository;
    const item = this as unknown as T;
    const itemId = item[idKey];
    return itemId ? repository.update(item) : repository.add(item);
  }

  @action reload(repository?: Repository<T>) {
    if (!repository) repository = this._orm.repository;
    if (!repository) {
      throw new Error('Model `reload` method called without repository');
    }
    return repository.reload(this as unknown as T);
  }
}
