WITH RankedHighScores AS (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY Name ORDER BY distance DESC) AS RowNum
    FROM [dbo].[HighScores]
)
DELETE FROM [dbo].[HighScores]
WHERE ID NOT IN (
    SELECT ID
    FROM RankedHighScores
    WHERE RowNum = 1
    ORDER BY distance DESC
    OFFSET 0 ROWS FETCH NEXT 20 ROWS ONLY
);
