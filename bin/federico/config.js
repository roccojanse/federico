/**
 * default configuration
 * @author Rocco Janse, roccojanse@outlook.com
 */
var Config = function() {

    var _this = this;
        src = './Frontend/';

    this.paths = {
        root: src,
        components: src + 'components/',
        elements: src + 'elements/'
    };

    return this;
};

module.exports = new Config();