module.exports = function prune(pg, redis) {
  setInterval(function() {
    pg.query(`DELETE FROM sessions
              WHERE expire < now()
              RETURNING *`,
    function(err, rows) {
      if (err) console.error(err);
      for (var i = 0, max = rows.length; i < max; i++) {
        redis.del(rows[i].token);
      }
    });
  }, 21600000);
};
