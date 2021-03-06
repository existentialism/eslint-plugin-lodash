'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../src/rules/prefer-includes')
const ruleTesterUtil = require('../testUtil/ruleTesterUtil')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = ruleTesterUtil.getRuleTester()
const toErrorMessage = require('../testUtil/optionsUtil').fromMessage('Prefer _.includes over indexOf comparison to -1')
ruleTester.run('prefer-includes', rule, {
    valid: [
        'if (_.includes(a, b)) {}',
        'x = _.indexOf(a, b) !== 2',
        'x = a.indexOf(b) === 2',
        {code: 'if (a.indexOf(b) !== -1) {}', options: [{includeNative: false}]}
    ],
    invalid: [
        'x = _.indexOf(a, b) === -1',
        'if (_.indexOf(a, b) !== -1) {}',
        {code: 'x = a.indexOf(b) !== -1', options: [{includeNative: true}]},
        'x = _.indexOf(a, b) > -1',
        'x = _.indexOf(a, b) >= 0',
        'x = _.indexOf(a, b) < 0',
        'x = -1 < _.indexOf(a, b)',
        'x = 0 <= _.indexOf(a, b)'
    ].map(toErrorMessage)
})
