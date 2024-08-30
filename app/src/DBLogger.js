import Database from 'better-sqlite3'
import { BaseLogger, getLevelIndex } from '@chatally/logger';

const DEBUG = getLevelIndex('debug')

export class DBLogger extends BaseLogger {
  /** @type {import("better-sqlite3").Statement<[string, string, string, number]>} */
  #insertMessage
  /**
   * Create a basic logger implementation, that logs to the console by default.
   *
   * This logger is not optimized and should only be used for development.
   *
   * For test purposes, the output can be redirected to any `Writable` by
   * setting the `out` property. Also for test purposes you can turn off the
   * timestamps, by setting the `timestamps` property to false.
   *
   * @param {import('@chatally/logger').LoggerOptions & {path?: string}} [options]
   * @param {import('@chatally/logger').LevelsFn} [levelsFn]
   */
  constructor(options, levelsFn) {
    super(options, levelsFn)
    const db = new Database(options.path || 'log.db')
    db.pragma('journal_mode = WAL')
    db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      'rowid' integer PRIMARY KEY AUTOINCREMENT,
      'id' varchar,
      'direction' varchar,
      'message' varchar,
      'timestamp' INTEGER
    );
    CREATE INDEX IF NOT EXISTS messages_by_id ON messages(id);
  `)
    this.#insertMessage = db.prepare(
      'INSERT INTO messages (id, direction, message, timestamp) VALUES (?, ?, ?, ?)',
    )
  }

  /**
   * @protected
   * @param {number} nLevel
   * @param {unknown} data
   * @param {string | undefined} msg
   * @param {unknown[]} args
   */
  _log(nLevel, data, msg, ...args) {
    if (nLevel === DEBUG) {
      if (msg === 'Received message') {
        const message = /** @type {any} */ (args[0])
        this.#insertMessage.run(
          message.from,
          'RECEIVED',
          JSON.stringify(message),
          Date.now()
        )
      } else if (msg === 'Sent message') {
        const message = /** @type {any} */ (args[0])
        this.#insertMessage.run(
          message.to,
          'SENT',
          JSON.stringify(message),
          Date.now()
        )
      }
    }
    // @ts-ignore
    super._log(nLevel, data, msg, ...args)
  }
}
