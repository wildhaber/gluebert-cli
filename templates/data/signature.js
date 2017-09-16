import { DataSignature } from 'gluebert/data';

/**
 * DataSignature for $NAME_UPPER_CAMEL$Data
 * @type {DataSignature}
 */
const $NAME_SNAKE_UPPER$_SIGNATURE = new DataSignature(
    '$NAME_HYPHEN$.data',
    () => import('./$NAME_HYPHEN$.data').then((data) => data.$NAME_UPPER_CAMEL$Data),
);

export {
    $NAME_SNAKE_UPPER$_SIGNATURE,
};