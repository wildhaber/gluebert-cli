import { DataSignature } from 'gluebert/data';

/**
 * DataSignature for $NAME$Data
 * @type {DataSignature}
 */
const $NAME$_SIGNATURE = new DataSignature(
    '$NAME$.data',
    () => import('./$NAME$.data').then((data) => data.$NAME$Data),
);

export {
    $NAME$_SIGNATURE,
};