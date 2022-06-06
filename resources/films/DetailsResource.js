"use strict";

class DetailsResource
{
	index = (request, response, result) =>
	{
		const film = result[0];

		const country =
		{
			id: film.filmCountry[0]._id,
			title: film.filmCountry[0].title
		}

		let genres = [];

		film.filmGenres.forEach((genre) =>
		{
			genres.push({
				id: genre._id,
				title: genre.title
			});
		});

		return {
			id: film._id,
			title: film.title,
			slug: film.slug,
			description: film.description,
			rating: film.rating,
			price: "$ " + film.price,
			cover_image: process.env.APP_URL + "/" + film.cover_image.replace("uploads/", ""),
			released_date: film.released_date,
			country: country,
			genres: genres,
			total_comments: film.film_comments[0]?.totalComments[0]?.count ?? 0,
			created_at: film.created_at
		};
	}
}

module.exports = { DetailsResource };