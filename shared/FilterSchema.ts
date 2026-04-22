import {z} from 'zod';
import { movieGenreNames } from './movieGenres.ts';

const filterSchema = z.object({
    title: z.string()
        .trim()
        .min(1, 'Title is required')
        .max(100, "Title cannot be longer than 100 characters"),
    includeAdult: z.preprocess((val) => {
        if (val === 'true') {
            return true;
        }

        if (val === 'false' || val === '' || val === undefined) {
            return false;
        }

        return val;
    }, z.boolean()),
    genre: z.preprocess((val) => {
        if(val === "") {
            return undefined;
        }
        return val;
    }, z.enum(movieGenreNames, "Invalid movie genre selection").optional()),
    //year: z.number().min(1000, 'Please select a valid date').optional(),
    year: z.preprocess((val) => {
        if(val === "") {
            return undefined;
        }
        if (typeof val === "string") {
            return Number.parseInt(val);
        }
        return val;
    }, z.number().int().min(1878, "The earliest movie was released in 1878").optional()),
});

export default filterSchema;