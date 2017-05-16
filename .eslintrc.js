// http://eslint.org/docs/user-guide/configuring

// Environments - which environments your script is designed to run in. Each environment brings with it a certain set of predefined global variables.
// Globals - the additional global variables your script accesses during execution.
// Rules - which rules are enabled and at what error level.

// [exploring-es6](http://exploringjs.com/es6/)(http://es6-org.github.io/exploring-es6/)

module.exports = {
//   "parser": "esprima",
  "parserOptions": {
    // ecmaVersion - set to 3, 5 (default), 6, or 7 to specify the version of ECMAScript you want to use.
    "ecmaVersion": 7,
    // "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },

  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "commonjs": true,
    // "mochajs": true
  },

  "globals": {
    "NODE_ENV": true,
    "NODE_CONFIG_DIR": true,
    "ROOT_PATH": true,
    "_": true,
    "$": true,
    "$$": true,
    "utils": true,
    "config": true,
    "fs": true,
    // "gm": true,
    "path": true,
    "logger": true
  },

  // "off"   or 0 - turn the rule off
  // "warn"  or 1 - turn the rule on as a warning (doesn’t affect exit code)
  // "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)

  "rules": {
    // Strict Mode Start {
    // [严格模式与 ECMAScript 6](https://github.com/luqin/exploring-es6-cn/blob/master/md/3.2.md)
    // 在 ECMAScript 6 中，类和模块内部都是隐式严格模式的 - 不需要写 use strict 标记。
    // 鉴于我们所有的代码都将在未来的模块中运行， ECMASCript 6 将整个语言升级为严格模式。
    // 通过语法特征被识别为ES6之后，就不再需要"use strict"指令
    "strict": [2, "global"],
    // } Strict Mode

    // Variables { ---------------------------------------------------
    // 是否统一在声明变量是一致进行初始化或者一律不允许初始化
    "init-declarations": 0,

    // 不允许出现和catch的异常变量同名的变量名，主要是考虑到目前还要兼容IE8
    "no-catch-shadow": 2,

    // 不允许对变量使用 delete
    "no-delete-var": 2,

    // 因为不允许使用标记，所以不用检测这一项
    "no-label-var": 0,

    "no-restricted-globals": 2,
    // 不允许使用和限制名相同的变量名
    "no-shadow-restricted-names": 2,

    // 不允许作用域链中出现同名的变量
    "no-shadow": [2, {
      "builtinGlobals": true,
      "hoist": "functions",
      "allow": ["resolve", "reject", "done", "fn", "cb", "callback"]
    }
    ],

    // 不允许初始化变量为undefined。因为不进行初始化，会默认初始化为undefined
    "no-undef-init": 2,

    // 不允许使用未经声明的变量
    "no-undef": 2,

    // 不允许使用undefined
    "no-undefined": 1,

    // 不允许声明没有被使用的变量。全局变量允许，同时参数只有最后一个需要被使用
    "no-unused-vars": [2, {vars: "local", args: "after-used"}],

    // 不允许在声明之前使用变量
    "no-use-before-define": [2, {"functions": false}],
    // } Variables ---------------------------------------------------


    /////////////////////////////////////////////////////////////////////////////////
    // [Possible Errors](http://eslint.org/docs/rules/#possible-errors)
    /////////////////////////////////////////////////////////////////////////////////
    // 不允许在布尔上下文中使用赋值表达式
    "no-cond-assign": [2, "except-parens"],

    // 对使用console进行警告，在生产环境中禁止使用console
    "no-console": 2,

    // 在布尔上下文中使用字面值时警告
    "no-constant-condition": 1,

    // 不允许在正则表达式中出现控制字符
    "no-control-regex": 2,

    // 对使用debugger报错，因为debugger并不是一个好的调试方法，在dev tools中直接打断点会好一些
    "no-debugger": 2,

    // 不允许同名参数
    "no-dupe-args": 2,

    // 不允许在对象中出现同名属性
    "no-dupe-keys": 2,

    // 不允许在switch语句中出现重复的case标签
    "no-duplicate-case": 2,

    // 不允许在正则表达式中使用空的字符集（`[]`）
    "no-empty-character-class": 2,

    // 不允许空的语句块
    "no-empty": 2,

    // 不允许在`try...catch`的`catch`块中赋值给异常参数
    "no-ex-assign": 2,

    // 不允许在布尔上下文中（使用`!!`）进行多余的布尔值类型转换。
    "no-extra-boolean-cast": 2,

    // 不允许使用多余的()
    "no-extra-parens": [0, "all", {
      "conditionalAssign": false,
      // "returnAssign": false,
      "nestedBinaryExpressions": false
    }],

    // 不允许多余的分号
    "no-extra-semi": 2,

    // 不允许给函数声明定义的函数变量进行赋值操作
    "no-func-assign": 2,

    // 不允许在语句块中进行函数声明
    // ES6中有了对块级作用域的支持，但是函数声明并不是语句；另外实际结果是ES6中函数声明会被限制在声明的块中
    "no-inner-declarations": 2,

    // 不允许无效的正则表达式
    "no-invalid-regexp": 2,

    // 不允许使用非常规空白字符
    // 关于非常规空白字符请查看：http://eslint.org/docs/rules/no-irregular-whitespace
    "no-irregular-whitespace": 2,

    // 不允许以函数形式调用全局对象Math和JSON，因为它们只是提供了一个命名空间
    "no-obj-calls": 2,

    "no-prototype-builtins": 2,

    // 不允许在正则表达式中连续使用多个空格，使用数量元字符
    "no-regex-spaces": 2,

    // 不允许使用稀疏数组直接量
    "no-sparse-arrays": 2,

    "no-template-curly-in-string": 0,

    // 不允许不合理（unexpected）的多行表达式
    "no-unexpected-multiline": 2,

    // 不允许出现永远不会被执行的代码
    // return、throw、break或者continue后面代码可能永远不会执行
    "no-unreachable": 2,

    "no-unsafe-finally": 0,

    "no-unsafe-negation": 0,

    // 使用`isNaN`方法，而不是使用比较操作符和`NaN`进行比较
    "use-isnan": 2,

    // // 使用有效的JSDoc注释
    // "valid-jsdoc": [
    //   "warn",
    //   {
    //     "prefer": {
    //       // return: "returns"
    //     },
    //     "requireReturn": false,
    //     "requireReturnType": false,
    //     "requireReturnDescription": false,
    //     "requireParamDescription": false
    //     // "matchDescription": "^[A-Z][A-Za-z0-9\\s]*[.]$"
    //   }
    // ],

    // 保证`typeof`的结果是和有效的类型字符串进行比较
    "valid-typeof": 2,

    /////////////////////////////////////////////////////////////////////////////////
    // [Best Practices](http://eslint.org/docs/rules/#best-practices)
    /////////////////////////////////////////////////////////////////////////////////
    // 如果不会用到访问器属性则不需要设置
    "accessor-pairs": 2,

    "array-callback-return": 2,

    // 按块级作用域使用var，同时就近声明变量
    "block-scoped-var": 2,

    "class-methods-use-this": 0,

    // 复杂性 高级话题
    "complexity": [0, 11],

    // 强制不同分支使用一致的返回值
    // 能够执行自然是好，只是有些严格，而且还不确定是否适合所有场景
    "consistent-return": 0,

    // 总是使用代码块，即使只有一条语句。
    "curly": 2,

    // 强制switch语句中始终添加default分支
    "default-case": 2,

    // 统一点操作符和属性名在同一行，点操作符出现在一行的开始
    "dot-location": [2, "property"],

    // 总是优先使用点操作符访问属性，同时允许使用点操作符访问保留字属性
    "dot-notation": [2, {"allowKeywords": true}],

    // 总是使用===
    "eqeqeq": 2,

    // 总是在for...in中使用hasOwnProperty进行检测
    "guard-for-in": 0,

    // 对alert、prompt和confirm进行警告
    "no-alert": 1,

    // 不允许使用arguments.caller/callee
    "no-caller": 2,

    // 不允许在case分支中进行变量声明、函数声明和类声明。因为它们只在相关分支执行时才会被执行
    "no-case-declarations": 2,

    // 是否允许疑似除法运算的正则表达式，即第一个字符是等号的正则表达式直接量`var re = /=foo/;`
    "no-div-regex": 0,

    // 不允许在包含return的if块后使用else块
    "no-else-return": 0,

    "no-empty-function": 2,

    "no-empty-pattern": 2,

    // 不允许和null进行相等判断
    "no-eq-null": 2,

    // 不允许使用eval
    "no-eval": 2,

    // 不允许扩充内置对象
    "no-extend-native": 2,

    // 不允许使用bind进行没有必要的this绑定
    "no-extra-bind": 2,

    "no-extra-label": 2,

    // switch中不允许使用fall through
    "no-fallthrough": 2,

    // 不允许省略浮点数中小数点前后的数字
    "no-floating-decimal": 2,

    "no-global-assign": 2,

    // 是否允许隐式类型转换
    // 个人建议可以考虑，它们的可读性更强。但是也要繁琐一些，毕竟`!!`、`"" + foo`和`+foo`等还是比较好用的
    "no-implicit-coercion": 0,

    "no-implicit-globals": 2,

    // 不允许给setTimeout和setInterval传递字符串作为第一个参数，它们是另一种形式的eval
    "no-implied-eval": 2,

    // 是否允许不必要的this，即是否只允许在类或者class like的对象中使用
    // 在构建可重用的方法时也可能用到，结合call和apply和写出更灵活的代码
    // 个人建议添加这条规则，并且在非类的情况下使用是在jsDoc中添加@this注释（这种情况下也不会报错），这样可以最大化可读性
    "no-invalid-this": 2,

    // 不允许使用SpiderMonkey引擎对JavaScript的扩展__iterator__
    "no-iterator": 2,

    // 不允许使用label
    "no-labels": 2,

    // 不允许使用单独的代码块
    "no-lone-blocks": 2,

    // 不允许在循环中定义函数，更具体的说是不允许在循环中定义的函数引用外层作用域的变量
    // 对于最常见的情况，使用let而不是var声明循环变量就可以了
    "no-loop-func": 2,

    // 不允许出现魔数，数字要使用有意义的变量
    // var TAX = 0.25;
    // var magic = {
    //   tax: TAX
    // };
    // var dutyFreePrice = 100;
    // var finalPrice = dutyFreePrice + (dutyFreePrice * magic.tax);
    // "no-magic-numbers": ["error", {"ignoreArrayIndexes": true, "enforceConst": true, "detectObjects": true }],
    "no-magic-numbers": 0,

    // 此规则影响现有规则
    // 不允许出现多个连续的空格
    "no-multi-spaces": 0,

    // 不允许使用续行符\来拼接字符串
    "no-multi-str": 2,

    // 不允许使用new Function，new Function是另一种形式的eval
    "no-new-func": 2,

    // 不允许使用`new`操作符调用直接量包裹构造函数来创建直接量
    "no-new-wrappers": 2,

    // 不允许以利用副作用的方式来使用`new`操作符。
    "no-new": 2,

    // 不允许使用八进制转义序列
    "no-octal-escape": 2,

    // 不允许使用八进制字面值
    "no-octal": 2,

    // 不允许函数参数进行赋值操作，包括参数的属性
    "no-param-reassign": [0, {"props": true}],

    // 不允许使用`__proto__`
    "no-proto": 2,

    // 不允许（在同一个作用域内）声明同名变量。
    "no-redeclare": 2,

    // 不允许在`return`语句中使用赋值表达式
    "no-return-assign": 2,

    // 不允许使用脚本URL
    "no-script-url": 2,

    "no-self-assign": 2,

    // 不允许一个值和它自身进行比较
    "no-self-compare": 2,

    // 不允许使用逗号操作符`,`在一个语句中包含多个表达式
    "no-sequences": 2,

    // 限制异常抛出的内容：Error对象或者基于Error的对象
    "no-throw-literal": 2,

    "no-unmodified-loop-condition": 2,

    // 不允许出现没有被使用的表达式
    "no-unused-expressions": 2,

    // 不允许不必要的`call`和`apply`
    "no-useless-call": 2,

    "no-useless-concat": 2,

    "no-useless-escape": 2,

    // 不允许使用void
    "no-void": 1,

    // 是否允许使用提醒注释
    "no-warning-comments": [0, {"terms": ["todo", "fixme", "xxx"], "location": "start"}],

    // 不允许使用with
    "no-with": 2,

    // 总是给parseInt提供第二个参数
    "radix": 0,

    // 是否总是在顶部声明所有的变量。
    "vars-on-top": 0,

    // 总是使用()包裹IIFE
    "wrap-iife": [2, "any"],

    // 是否要求使用yoda表达式。
    "yoda": 0,


    //////////////////////////////////////////////////////////////////////
    // [Node.js and CommonJS](http://eslint.org/docs/rules/#nodejs-and-commonjs)
    //////////////////////////////////////////////////////////////////////

    // 强制把回调放在`return`语句中
    "callback-return": 2,

    // 强制在模块的顶层使用`require`加载所有模块
    "global-require": 2,

    // 强制在回调中处理错误
    "handle-callback-err": 2,

    // 是否强制所有模块加载放在一起，同时按类型分块
    "no-mixed-requires": [2, {"grouping": true, "allowCall": true}],

    // 不允许使用`new`调用`require`的模块
    "no-new-require": 2,

    // 禁止在使用`__dirname`和`__filename`时使用字符串拼接来创建路径
    "no-path-concat": 2,

    // 不允许使用process.env
    "no-process-env": 2,

    // 不允许使用process.exit
    "no-process-exit": 2,

    // 是否限制使用某些模块
    "no-restricted-modules": 0,

    // disallow certain properties on certain objects
    "no-restricted-properties": 0,

    // 不允许使用同步函数
    "no-sync": 2,


    //////////////////////////////////////////////////////////////////////
    // [ECMAScript 6](http://eslint.org/docs/rules/#ecmascript-6)
    //////////////////////////////////////////////////////////////////////
    // 只在需要的时候为函数体添加`{}`
    "arrow-body-style": [0, "as-needed"],

    // 总是将参数用小括号`()`括起来，统一一致。
    // --fix
    "arrow-parens": [1, "always"],

    // 强制在箭头函数的箭头前面和后面添加一个空格
    // --fix
    "arrow-spacing": [2, {"before": true, "after": true}],

    // 验证类定义中`super()`的使用，只在有extends时使用super()
    "constructor-super": 2,

    // * 左边有空格，右边无空格
    // --fix
    "generator-star-spacing": [2, {"before": true, "after": false}],

    // 不允许修改类声明创建的变量
    "no-class-assign": 2,

    // 在布尔上下文中，使用箭头函数必须用括号括起来
    "no-confusing-arrow": ["error", {"allowParens": false}],

    // 不允许对`const`声明的变量进行重新赋值
    "no-const-assign": 2,

    // 不允许在类声明中出现重复的类成员
    "no-dupe-class-members": 2,

    // 不允许重复的导入
    "no-duplicate-imports": ["error", {"includeExports": true}],

    // 不允许使用 new Symbol();
    "no-new-symbol": 2,

    // 限制导入某些指定的模块
    "no-restricted-imports": ["error"],

    // 在类声明的`constructor`中，不允许在执行`super()`之前使用`this`和`super`
    "no-this-before-super": 2,

    // This rule disallows unnecessary usage of computed property keys.
    "no-useless-computed-key": 2,

    // This rule flags class constructors that can be safely removed without changing how the class works.
    "no-useless-constructor": 2,

    // 不要进行没有用的重命名，如：foo as foo
    "no-useless-rename": 2,

    // 强制使用`const`和`let`，不允许使用`var`
    "no-var": 2,

    // 强制使用简洁的对象字面值语法
    "object-shorthand": [0, "always"],

    // 优先使用箭头函数而不是函数表达式声明回调函数
    // --fix
    "prefer-arrow-callback": [0, {"allowNamedFunctions": true}],

    // 优先使用`const`，需要使用const的情景识别错误
    "prefer-const": 2,

    "prefer-numeric-literals": 0,

    // 优先使用Reflect方法
    "prefer-reflect": 0,

    // 优先使用(...args)形式参数
    "prefer-rest-params": 0,

    // 优先使用spread操作符而不是`apply`方法
    "prefer-spread": 0,

    // 优先使用模板字符串，而不是字符串拼接
    "prefer-template": 0,

    // 不允许使用不含有`yield`关键字的generator
    "require-yield": 2,

    // spread ...args 三个点和参数名之间无空格
    "rest-spread-spacing": ["error", "never"],

    // 
    "sort-imports": ["error", {
      "ignoreCase": false,
      "ignoreMemberSort": false,
      "memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
    }],

    // 使用Symbol时必须制定description参数
    "symbol-description": 2,

    // 模板字符串，变量与花括号{}之间不能有空格
    "template-curly-spacing": ["error", "never"],

    // yield语句中， * 左边有空格，* 右边无空格
    "yield-star-spacing": ["error", "before"],


    //////////////////////////////////////////////////////////////////////
    // [Stylistic Issues](http://eslint.org/docs/rules/#stylistic-issues)
    //////////////////////////////////////////////////////////////////////

    // [√] 数组内，侧紧贴`[]`的位置不允许添加空格
    // --fix
    "array-bracket-spacing": [
      2, "never",
      {"singleValue": false, "objectsInArrays": false, "arraysInArrays": false}
    ],

    // [√] 紧贴`{}`位置必须有空格
    // --fix
    "block-spacing": [2, "always"],

    // 始终使用代码块，且代码块的左括号 { 不出现在行首
    "brace-style": [2, "1tbs", {"allowSingleLine": false}],

    // 必须使用驼峰命名法，无论是变量名还是属性名
    "camelcase": [2, {"properties": "always"}],

    // 禁止悬挂逗号，即：对象或数组最后一个属性或成员末尾的逗号。
    // --fix
    "comma-dangle": [2, "never"],
    // 逗号前不能有空格，逗号后又一个空格。
    // --fix
    "comma-spacing": [2, {"before": false, "after": true}],
    // 逗号不能出现在行首，即还行的时候，逗号要留在行尾。逗号在行首容易注释。
    // --fix
    "comma-style": [2, "last"],

    // 不允许计算属性中添加空格。计算熟悉不要使用方括号语法访问属性
    // --fix
    "computed-property-spacing": [2, "never"],

    // 统一使用词法this，并且使用context作为变量名。
    // 保证this正确有两种方法：词法this，包括使用变量存储和箭头函数；使用bind
    // that, self or me.
    "consistent-this": [2, "self"],

    // 非空文件以换行符结尾
    // --fix
    "eol-last": 2,

    // 函数调用函数名和圆括号之间不能有空格
    // --fix
    "func-call-spacing": ["error", "never"],
    // 要求始终使用命名函数表达式，警告。有时给函数表达式起名比较繁琐
    "func-names": [0, "always"],
    // 统一使用函数表达式。统一使用函数表达式，与变量声明 箭头函数保持一致的风格。
    "func-style": [0, "expression", {"allowArrowFunctions": true}],

    // 标识符黑名单
    // "id-blacklist": ["error", "data", "callback"],
    // "id-blacklist": ["error", "data", "err", "e", "cb", "callback"],
    // 是否统一标志符满足某个模式, camelcase
    // "id-match": ["error", "^(_?[a-z]+([A-Z][a-z]+)*)|(_?[_A-Z]$)"],
    // 是否限制标志符的长度，最少1个字符。
    "id-length": ["error", {"min": 1, "max": 64, "exceptions": ["_", "$"]}],

    // 缩进使用两个空格, 在一些语句中可以做一些调整，以增强可读性。
    // --fix
    "indent": [2, 2, {"SwitchCase": 1, "VariableDeclarator": {"var": 2, "let": 2, "const": 2}}],

    // jsx属性使用双引号
    // --fix
    "jsx-quotes": [2, "prefer-double"],

    // 对象字面值，统一在冒号后面添加一个空格，冒号前面不允许有空格
    // --fix
    "key-spacing": [0, {"beforeColon": false, "afterColon": true}],

    // 关键字前加空格
    // --fix
    "keyword-spacing": ["error", {"before": true, "after": true}],

    // 行注释的位置统一在上方。
    "line-comment-position": ["error", {"position": "above"}],

    // 是否统一在注释前后添加一个空行
    "lines-around-comment": ["error", {
      "beforeBlockComment": true,
      "afterBlockComment": false,
      "beforeLineComment": true,
      "afterLineComment": false,
      "allowBlockStart": true,
      "allowObjectStart": true
    }],

    // 使用Unix换行符"LF"
    // --fix
    "linebreak-style": ["error", "unix"],

    // 指令周围的语句风格
    "lines-around-directive": ["error", "always"],

    // 最大的嵌套深度。
    "max-depth": ["error", {"max": 4}],

    // 指定一行的最大字符数
    // https://github.com/eslint/eslint/blob/master/docs/rules/max-len.md
    // "max-len": ["error", 80],

    "max-lines": [2, {"max": 2000, "skipBlankLines": true}],

    // 指定最大回调嵌套层数, 
    "max-nested-callbacks": ["error", {"max": 4}],

    // 函数参数的个数上限
    "max-params": [2, 8],

    // 每行中的限制1条语句。
    "max-statements-per-line": ["error", {"max": 1}],

    // 一个函数中20条语句
    "max-statements": ["error", 50, {"ignoreTopLevelFunctions": true}],

    // 三元运算符始终在一行。
    // "multiline-ternary": ["error", "never"],

    // 强制构造函数首字母大写
    "new-cap": [2, {"newIsCap": true, "capIsNew": false}],

    // 不允许当构造函数没有参数时省略()进行调用
    // --fix
    "new-parens": 2,

    // 在声明之后添加一个空行
    "newline-after-var": [0, "always"],

    // 是否在return语句前面加空行
    "newline-before-return": 0,

    // 链式调用时超过2级嵌套式必须换行
    "newline-per-chained-call": ["error", {"ignoreChainWithDepth": 3}],

    // 不允许使用Array来创建数组
    // 唯一的例外是可以使用new Array创建一定长度的由某些字符重复构成的字符串，相当于ES6字符串的repeate的方法
    "no-array-constructor": 2,

    // 不允许使用位操作
    // "no-bitwise": ["error", {"int32Hint": true}],

    // 不建议使用continue
    "no-continue": 1,

    // 是否允许在一行的末尾添加注释，降低可维护性
    "no-inline-comments": 2,

    // 不允许else块只有一个单独的if块
    "no-lonely-if": 2,

    // 不允许混合的操作符
    "no-mixed-operators": [
      "error",
      {
        "groups": [
          ["+", "-", "*", "/", "%", "**"],
          ["&", "|", "^", "~", "<<", ">>", ">>>"],
          ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
          ["&&", "||"],
          ["in", "instanceof"]
        ],
        "allowSamePrecedence": true
      }
    ],

    // 不允许混合空格和制表符
    "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],

    // 不允许多个连续空行，最多连续的空行数为2，文档末尾最多1个空行
    // --fix
    "no-multiple-empty-lines": [2, {"max": 2, "maxEOF": 1}],

    // 不允许在if-else中使用否定条件，可以通过调整语句块或者表达式的顺序完全避免`！`
    "no-negated-condition": 2,

    // 不允许使用嵌套的三元操作符
    "no-nested-ternary": 2,

    // 不允许使用Object构造函数创建对象
    "no-new-object": 2,

    // 只允许在for循环中使用 ++ --
    "no-plusplus": ["off", {"allowForLoopAfterthoughts": true}],

    // 不适用受限制的语法
    // "no-restricted-syntax": ["error", "FunctionExpression", "WithStatement"],

    "no-tabs": 2,

    // 是否允许使用三元操作符
    "no-ternary": 0,

    // 不允许在行尾出现空白字符
    // --fix
    "no-trailing-spaces": ["error", { "skipBlankLines": true }],

    // 是否允许变量名以下划线开始或结尾，只允许在this上出现。
    "no-underscore-dangle": ["error", {"allowAfterThis": true, "allowAfterSuper": true}],

    // 不允许使用可以被简化的三元操作符
    "no-unneeded-ternary": 2,

    // 不允许属性和对象之间有空格
    // --fix
    "no-whitespace-before-property": 2,

    // --fix
    // "object-curly-newline": ["error", {
    //     "ObjectExpression": "always",
    //     "ObjectPattern": { "multiline": true }
    // }],

    // 统一在对象字面值中紧贴{}是否添加一个空格, objectsInObjects/arraysInObjects
    // --fix
    "object-curly-spacing": [2, "never"],

    "object-property-newline": [2, {"allowMultiplePropertiesPerLine": true}],

    // 每行只声明一个变量
    "one-var-declaration-per-line": ["error", "initializations"],

    // 一个变量对应一个var
    "one-var": [2, "never"],

    // 使用使用简写的赋值操作符。+=、-=、*=、/=
    "operator-assignment": ["error", "always"],

    // 统一拆分过长表达式时操作符的位置
    "operator-linebreak": [2, "before"],

    // 不允许在代码块的开始和结尾添加空行
    // --fix
    "padded-blocks": [2, "never"],

    // 对象属性名引号的添加情况
    "quote-props": [2, "as-needed", {"keywords": false, "unnecessary": true, "numbers": false}],

    // 字符串统一使用单引号包裹，当为了避免转义时可以使用双引号
    // --fix
    "quotes": [2, "single", "avoid-escape"],

    // // 必须写JSDoc
    // "require-jsdoc": ["error", {
    //   "require": {
    //     // "FunctionDeclaration": true,
    //     "MethodDefinition": false,
    //     "ClassDeclaration": false
    //   }
    // }],

    // 当`;`出现在表达式中间时，统一在它的后面添加一个空格，前面不允许有空格
    // --fix
    "semi-spacing": [2, {"before": false, "after": true}],

    // 总是使用`;`
    // --fix
    "semi": [2, "always"],

    // 不要求对声明的变量按字母顺序进行排序
    "sort-keys": 0,
    "sort-vars": 0,

    // 统一是否在代码块的左括号前面添加空格
    // --fix
    "space-before-blocks": 2,

    // 命名函数表达式()前面不允许有空格，匿名函数表达式()前面要添加一个空格
    // --fix
    "space-before-function-paren": [2, {"anonymous": "always", "named": "never"}],

    // 不允许在()内侧添加空格
    // --fix
    "space-in-parens": ["error", "never"],

    // 强制在中缀操作符两侧添加一个空格
    // --fix
    "space-infix-ops": 2,

    // 统一一元操作符中空格的使用
    // --fix
    "space-unary-ops": [2, {"words": true, "nonwords": false}],

    // 强制在注释前添加一个空格，除了一些标志注释之外
    // --fix
    "spaced-comment": [2, "always", {
      "exceptions": ["-", "+"],
      "markers": ["=", "!"]           // space here to support sprockets directives
    }],

    // --fix
    "unicode-bom": ["error", "never"],

    // 是否统一包裹正则表达式
    // --fix
    "wrap-regex": 0
  }
};

