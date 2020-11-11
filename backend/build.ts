/**
 * Remove old files, copy front-end ones.
 */

import fs from 'fs-extra';
import logger from "./src/config/logger";

try {
    // Remove current build
    fs.removeSync('./build/');
    // Copy front-end files
    fs.copySync('./src/public', './build/public');
    fs.copySync('./src/views', './build/views');
} catch (err) {
    logger.err(err);
}
