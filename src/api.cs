else if (req.Method == HttpMethod.Post.Method)
{
    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    dynamic data = JsonConvert.DeserializeObject(requestBody);

    // Extract data from request
    string name = data?.name;
    double hitAngle = data?.hitAngle ?? 0.0;
    double hitStrength = data?.hitStrength ?? 0.0;
    int gameAreaHeight = data?.gameAreaHeight ?? 0;
    double.TryParse(data?.distance?.ToString(), out double distance);
    int poroHits = data?.poroHits ?? 0;

    // Determine the correct table based on dataType
    string tableName = data?.dataType == "AllTime" ? "AllTime" : 
                       data?.dataType == "Weekly" ? "Weekly" : null;

    if (tableName == null)
    {
        return new BadRequestResult(); // or some other appropriate action
    }

    var query = $@"
    INSERT INTO {tableName} (Name, Angle, HitStrength, ScreenVH, Distance, PoroHits) 
    VALUES (@Name, @Angle, @HitStrength, @ScreenVH, @Distance, @PoroHits)";

    try
    {
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            conn.Open();
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@Name", name);
                cmd.Parameters.AddWithValue("@Angle", hitAngle);
                cmd.Parameters.AddWithValue("@HitStrength", hitStrength);
                cmd.Parameters.AddWithValue("@ScreenVH", gameAreaHeight);
                cmd.Parameters.AddWithValue("@Distance", distance);
                cmd.Parameters.AddWithValue("@Porohits", poroHits);

                await cmd.ExecuteNonQueryAsync();
            }
        }

        return new OkObjectResult($"Data inserted successfully for: {name}");
    }
    catch (SqlException e)
    {
        log.LogError($"Database error: {e.Message}");
        return new StatusCodeResult(500);
    }
    catch (Exception e)
    {
        log.LogError($"Internal server error: {e.Message}");
        return new StatusCodeResult(500);
    }
}
else
{
    return new BadRequestResult();
}
