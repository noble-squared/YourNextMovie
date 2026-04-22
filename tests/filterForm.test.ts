import {z} from 'zod';
import { describe, it, expect } from 'vitest';
import filterSchema from '../shared/filterSchema';

//https://stevekinney.com/courses/full-stack-typescript/testing-zod-schema

describe('FilterForm', () => {
    it("shouldn't work with an empty title", () => {
        const emptyData = { title: "", genre:"", year:"" };
        const result = filterSchema.safeParse(emptyData);
        expect(result.success).toBeFalsy();

        //expect(result.data).toEqual(emptyData); // Assert parsed data is as expected
    });

    it("should work with only title filled out", () => {
        const titleOnlyData = { title: "Something", genre:"", year:"" };
        const result = filterSchema.safeParse(titleOnlyData);
        expect(result.success).toBeTruthy();

        //expect(result.data).toEqual(titleOnlyData); // Assert parsed data is as expected
    });

    it('should work with valid inputs', () => {
        const validData = { title: "Tangled", genre:"Family", year:"2007" } //I don't actually know when Tangled was released, but for this test that's fine
        const result = filterSchema.safeParse(validData);
        expect(result.success).toBeTruthy();
    });

    it("should throw a zod error for non-applicable genre selection", () => {
        const invalidGenre = { title: "", genre:"pillow case", year:"" };
        const result = filterSchema.safeParse(invalidGenre);
        expect(result.success).toBeFalsy();
        if (!result.success) {
            expect(result.error).toBeInstanceOf(z.ZodError); // Assert error is ZodError
            expect(result.error.message).contain('Invalid movie genre selection'); // Assert error message
        }
    });

    it("should throw a zod error for a too lengthy title", () => {
        const invalidTitle = { title:"hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
            genre: "",
            year:""
        };
        const result = filterSchema.safeParse(invalidTitle);
        expect(result.success).toBeFalsy();
        if (!result.success) {
            expect(result.error).toBeInstanceOf(z.ZodError); // Assert error is ZodError
            expect(result.error.message).contain("Title cannot be longer than 100 characters"); // Assert error message
        }
    });

    it("should throw a zod error for a too-small year input", () => {
        const invalidData = { title:"", genre: "", year:"2" };
        const result = filterSchema.safeParse(invalidData);
        expect(result.success).toBeFalsy();
        if(!result.success) {
            expect(result.error).toBeInstanceOf(z.ZodError); // Assert error is ZodError
            expect(result.error.message).contain("The earliest movie was released in 1878");
        }
    });

    it('should throw zod errors for multiple problems with input', () => {
        const invalidData = { title:"", genre: "Skirt", year:"4" };
        const result = filterSchema.safeParse(invalidData);
        expect(result.success).toBeFalsy();
        if(!result.success) {
            expect(result.error).toBeInstanceOf(z.ZodError); // Assert error is ZodError
            expect(result.error.message).contain('Invalid movie genre selection');
            expect(result.error.message).contain("The earliest movie was released in 1878");
        }
    });
});