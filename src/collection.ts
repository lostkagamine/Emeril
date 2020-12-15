/**
 * Something that can be identified.
 * Most Discord classes do implement this.
 */
export interface Identifiable {
    id: string | number;
}

/**
 * To hold a bunch of something identifiable.
 * @extends Map
 */
export default class Collection<T extends Identifiable> extends Map {
    /**
     * Updates an object within the Collection.
     * Behaves like an upsert, i.e. if it's not there, insert it, if it is, update it instead.
     * @param obj The object data to update.
     */
    public update(obj: T) {
        const item = this.get(obj.id);
        if (!item) {
            return this.add(obj);
        }
        this.set(obj.id, obj);
    }

    /**
     * Adds an element into the Collection.
     * @param obj The object data to insert.
     */
    public add(obj: T) {
        this.set(obj.id, obj);
    }

    /**
     * Removes an element from the Collection.
     * If it's not there, does nothing.
     * @returns {Object?} The removed object, or null if nothing was removed.
     */
    public remove(obj: T): T | null {
        const item = this.get(obj.id);
        if (!item) return null;
        this.delete(item.id);
        return item;
    }

    /**
     * Applies a function to every element of the Collection,
     * and returns an array with the results.
     * @returns {Array} All collection elements with the function applied to them.
     */
    public map(func: Function) {
        const arr = [];
        for (const item of this.values()) {
            arr.push(func(item));
        }
        return arr;
    }

    /**
     * Finds the first element in the Collection that makes Function return truthy.
     * @param func The function to run.
     * @returns {Object} The element.
     */
    public find(func: Function) {
        for (let i of this.values()) {
            if (func(i)) {
                return i;
            }
        }
        return null;
    }
}