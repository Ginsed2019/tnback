INSERT INTO activities2
SELECT
	a2.id AS id,
	a1.name AS name,
	a1.`group` AS `group`,
	a1.about AS about,
	a2.start AS start,
	a2.end AS end,
	a2.`limit` AS `limit`
    FROM activities AS a1
    LEFT JOIN times AS a2 ON a1.id = a2.activity
WHERE a2.id NOT NULL
