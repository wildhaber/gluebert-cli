import { ModuleSignature } from 'gluebert/module';

/**
 * ModuleSignature for $NAME$
 * @type {ModuleSignature}
 */
const $NAME_SNAKE_UPPER$_MODULE = new ModuleSignature(`$NAME_HYPHEN$`, `$SELECTOR$`)
    .setImportController(() => import('./$NAME_HYPHEN$.controller').then((controller) => controller.$NAME_UPPER_CAMEL$Controller))
    .setImportStyles(() => import('./$NAME_HYPHEN$.styles.scss'));

export {
    $NAME_SNAKE_UPPER$_MODULE,
};