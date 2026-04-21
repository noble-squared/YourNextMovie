import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { SingleMovie } from "../../shared/MovieTypes";
import ExpandedMovieComponent from "../components/ExpandedMovie";

const IndividualMoviePage: React.FC = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState<SingleMovie>();
    const [error, setError] = useState<string>("");

    useEffect(() => {
        async function init() {
            const res = await fetch(`/api/get-movie/${id}`);

            if(!res.ok){
                console.error(await res.text());
                setError(await res.text() || "Failed to fetch movie. Please try again later.");
            } else {
                const data = await res.json();
                console.log(data.results);
                setMovie(data.results);
            }

            setLoading(false);
        }

        init();
    }, [id]);

    return (
        <>
            <Link to="/movies">Back to search</Link>
            {error && 
                <div className="error">
                    <p>{error}</p>
                </div>
            }
            {loading ? (
                <>
                <h2>Loading...</h2>
                </>
            ) : (
                <>
                    {movie ? (
                        <ExpandedMovieComponent movie={movie} />
                    ) : (
                        <h2>Movie not found</h2>
                    )}
                </>
            )}
        </>
    )
}

export default IndividualMoviePage;