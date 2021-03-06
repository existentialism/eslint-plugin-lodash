/**
 * @fileoverview Rule to check if the macthesProperty shorthand can be used
 */
'use strict'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
module.exports = function (context) {
    const {isLodashCallToMethod, getShorthandVisitor} = require('../util/lodashUtil')
    const {isEqEqEqToMemberOf, getValueReturnedInFirstLine, getFirstParamName} = require('../util/astUtil')
    const settings = require('../util/settingsUtil').getSettings(context)
    const onlyLiterals = context.options[1] && context.options[1].onlyLiterals

    function isFunctionDeclarationThatCanUseShorthand(func) {
        return isEqEqEqToMemberOf(getValueReturnedInFirstLine(func), getFirstParamName(func), Infinity, false, onlyLiterals)
    }

    function canUseShorthand(iteratee) {
        return isFunctionDeclarationThatCanUseShorthand(iteratee) || isLodashCallToMethod(iteratee, settings, 'matchesProperty')
    }

    function callHasExtraParamAfterIteratee(node, iteratee) {
        return node.arguments[node.arguments.indexOf(iteratee) + 1]
    }

    const matchesPropertyChecks = {
        3(node, iteratee) {
            return iteratee && iteratee.type === 'Literal' && callHasExtraParamAfterIteratee(node, iteratee)
        },
        4(node, iteratee) {
            return iteratee && iteratee.type === 'ArrayExpression'
        }
    }

    return {
        CallExpression: getShorthandVisitor(context, settings, {
            canUseShorthand,
            usesShorthand: matchesPropertyChecks[settings.version]
        }, {
            always: 'Prefer matches property syntax',
            never: 'Do not use matches property syntax'
        })
    }
}

module.exports.schema = [
    {
        enum: ['always', 'never']
    }, {
      type: 'object',
      properties: {
          onlyLiterals: {
              type: 'boolean'
          }
      }
    }
]
