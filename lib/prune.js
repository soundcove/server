module.exports = function(pg, redis) {
  return function() {
    // Delete all tokens that have expired.
    pg.query(`DELETE FROM sessions
              WHERE expire < now()
              RETURNING *`,
    function(err, rows) {
      if (err) console.error(err);
      for (var i = 0, max = rows.length; i < max; i++) {
        redis.del(rows[i].token);
      }
    });
  };
};
