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
                        .query('SELECT * FROM Clients WHERE ClientID = @id');
                    context.res = { body: result.recordset[0] };
                } else {
                    const result = await pool.request().query('SELECT * FROM Clients');
                    context.res = { body: result.recordset };
                }
                break;

            case 'post':
                const { Name } = req.body;
                const insertResult = await pool.request()
                    .input('Name', sql.NVarChar(100), Name)
                    .query('INSERT INTO Clients (Name) VALUES (@Name); SELECT SCOPE_IDENTITY() AS ClientID;');
                context.res = { body: { ClientID: insertResult.recordset[0].ClientID, Name } };
                break;

            case 'put':
                const { ClientID, Name: UpdatedName } = req.body;
                await pool.request()
                    .input('ClientID', sql.Int, ClientID)
                    .input('Name', sql.NVarChar(100), UpdatedName)
                    .query('UPDATE Clients SET Name = @Name WHERE ClientID = @ClientID');
                context.res = { body: { ClientID, Name: UpdatedName } };
                break;

            case 'delete':
                const { id } = req.params;
                await pool.request()
                    .input('ClientID', sql.Int, id)
                    .query('DELETE FROM Clients WHERE ClientID = @ClientID');
                context.res = { body: { message: `Client with ID ${id} deleted successfully.` } };
                break;

            default:
                context.res = { status: 400, body: 'Invalid HTTP method' };
        }
    } catch (error) {
        context.log.error('Error:', error);
        context.res = { status: 500, body: `Error: ${error.message}` };
    }
};
