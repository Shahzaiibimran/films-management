"use strict";

class IndexResource
{
	index = (request, response, result) =>
	{
		let films = [];

		if (Array.isArray(result) && result.length > 0)
		{
			result.forEach((film) =>
			{
				films.push({
					id: film._id,
					title: film.title,
					slug: film.slug,
					rating: film.rating,
					price: "$ " + film.price,
					cover_image: process.env.APP_URL + "/" + film.cover_image.replace("uploads/", ""),
					released_date: film.released_date,
					created_at: film.created_at
				});
			});
		}

		return films;
	}
}

module.exports = { IndexResource };