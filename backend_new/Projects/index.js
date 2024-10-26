const { sql, poolPromise } = require('../shared/db');

module.exports = async function (context, req) {
    const pool = await poolPromise;
    const method = req.method.toLowerCase();

    try {
        switch (method) {
            case 'get':
                if (req.params.id) {
                    const result = await pool.request()
                        .input('id', sql.Int, req.params.id)
                        .query('SELECT * FROM Projects WHERE ProjectID = @id');
                    context.res = { body: result.recordset[0] };
                } else {
                    const result = await pool.request().query('SELECT * FROM Projects');
                    context.res = { body: result.recordset };
                }
                break;

            case 'post':
                const { Name, Num, VesselID } = req.body;
                const insertResult = await pool.request()
                    .input('Name', sql.NVarChar(200), Name)
                    .input('Num', sql.Int, Num)
                    .input('VesselID', sql.Int, VesselID)
                    .query('INSERT INTO Projects (Name, Num, VesselID) VALUES (@Name, @Num, @VesselID); SELECT SCOPE_IDENTITY() AS ProjectID;');
                context.res = { body: { ProjectID: insertResult.recordset[0].ProjectID, Name, Num, VesselID } };
                break;

            case 'put':
                const { ProjectID, Name: UpdatedName, Num: UpdatedNum, VesselID: UpdatedVesselID } = req.body;
                await pool.request()
                    .input('ProjectID', sql.Int, ProjectID)
                    .input('Name', sql.NVarChar(200), UpdatedName)
                    .input('Num', sql.Int, UpdatedNum)
                    .input('VesselID', sql.Int, UpdatedVesselID)
                    .query('UPDATE Projects SET Name = @Name, Num = @Num, VesselID = @VesselID WHERE ProjectID = @ProjectID');
                context.res = { body: { ProjectID, Name: UpdatedName, Num: UpdatedNum, VesselID: UpdatedVesselID } };
                break;

            case 'delete':
                const { id } = req.params;
                await pool.request()
                    .input('ProjectID', sql.Int, id)
                    .query('DELETE FROM Projects WHERE ProjectID = @ProjectID');
                context.res = { body: { message: `Project with ID ${id} deleted successfully.` } };
                break;

            default:
                context.res = { status: 400, body: 'Invalid HTTP method' };
        }
    } catch (error) {
        context.log.error('Error:', error);
        context.res = { status: 500, body: `Error: ${error.message}` };
    }
};
