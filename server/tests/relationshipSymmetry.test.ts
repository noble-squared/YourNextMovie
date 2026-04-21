import { expect, test } from 'vitest'
import genreRelationships from '../genreRelationships';

test("Test that all relationships in 'genreRelationships' are symmetrical", () => {
    for (let outer in genreRelationships.keys) {
        for(let inner in genreRelationships.keys) {
            expect(genreRelationships.get(outer)?.get(inner)).toBe(genreRelationships.get(inner)?.get(outer));
        }
    }
});