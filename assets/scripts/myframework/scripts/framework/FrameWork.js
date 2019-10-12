





// window may be undefined when first load engine from editor
var _global = typeof window === 'undefined' ? global : window;

/**
 * !#en
 * The main namespace of framework
 * !#zh
 * 框架的主要命名空间，框架代码中所有的类，函数，属性和常量都在这个命名空间中定义。
 * @module yx
 * @main yx
 */
_global.yx = _global.yx || {};

_global.yx.version = "0.0.1";

console.log("framework init:" + _global.yx.version);


require('PreDefine');

module.exports = _global.yx;