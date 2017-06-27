/* eslint-env node, mocha */
var chai = require("chai");
var expect = chai.expect;
var sinon = require("sinon");

var TranslateManager = require("./../../../src/modules/translatemanager/TranslateManager");
var FormManager = require("./../../../src/modules/formmanager/FormManager");

class Foo {
    constructor() {
        /**
         * @Property("b");
         * @Type("string");
         * @Title("Foo");
         * @Required(true);
         * @Maxlength(5);
         * @Default("FooBar");
         */
        this.b = null;

        /**
         * @Property("a");
         * @Type("integer");
         * @Title("const.test");
         * @Required(true);
         */
        this.a = null;

        /**
         * @Property("e");
         * @Type("number");
         * @Range([1, 10]);
         * @Title("const.test");
         * @Required(true);
         */
        this.e = null;

        /**
         * @Property("c");
         * @Type("string");
         * @Title("Bar");
         * @Enum(["foo", "bar"]);
         * @EnumNames(["Foo", "Bar"]);
         * @Required(false);
         */
        this.c = null;

        /**
         * @Property("d");
         * @Type("string");
         * @Title("Bar");
         * @Enum("getValues");
         * @EnumNames(["WOODY", "Bar"]);
         * @Required(false);
         */
        this.d = null;

        /**
         * @Property("f");
         * @Type("boolean");
         * @Title("I'm a boolean");
         * @Default(true);
         */
        this.f = null;

        /**
         * @Property("g");
         * @Type("string");
         * @Title("I'm a radio");
         * @Enum(["a", "b"]);
         * @EnumNames(["Option A", "Option B"]);
         * @Display("radio")
         */
        this.g = null;

        /**
         * @Property("h");
         * @Type("string");
         * @Title("I'm disabled");
         * @Disabled(true);
         * @Value("FooBar")
         */
        this.h = null;

        /**
         * @Property("i");
         * @Type("string");
         * @Title("I'm read only");
         * @Readonly(true);
         * @Value("FooBar")
         */
        this.i = null;

        /**
         * @Property("j");
         * @Type("string");
         * @Title("I'm hidden");
         * @Hidden(true);
         * @Value("FooBar")
         */
        this.j = null;

        /**
         * @Property("k");
         * @Type("string");
         * @Title("I'm a textarea");
         * @Display("textarea");
         * @Value("FooBar")
         */
        this.k = null;

        /**
         * @Property("l");
         * @Type("string");
         * @Title("Bar");
         * @Enum("getValues");
         * @EnumNames(["WOODY", "Bar"]);
         * @Display("checkbox");
         * @Unique(true)
         * @Required(false);
         */
        this.l = null;

        /**
         * @Property("m");
         * @Type("string");
         * @Title("I'm a color picker");
         * @Display("color");
         * @Value("#FF0000")
         */
        this.m = null;

        /**
         * @Property("n");
         * @Type("date");
         * @Title("Pick a date");
         */
        this.n = null;

        /**
         * @Property("o");
         * @Type("datetime");
         * @Title("Pick a date time");
         */
        this.o = null;
    }

    static getValues(...inject) {
        return [inject[0], inject[1]];
    }
}

class Bar extends Foo {
    constructor() {
        super();
        /**
         * @Property("zz");
         * @Type("datetime");
         * @Title("Another extended form");
         */
        this.o = null;

        /**
         * @Property("zzi");
         * @Type("objects");
         * @Cl("BarFoo");
         * @Title("Pick sub objects !");
         */
        this.zzi = null;

        /**
         * @Property("zzj");
         * @Type("object");
         * @Cl("BarFoo");
         * @Title("Pick only one sub object !");
         */
        this.zzj = null;
    }
}

class FooBar extends Bar {
    constructor() {
        super();
    }
}

class BarFoo {
    constructor() {
        /**
         * @Property("xo");
         * @Type("string");
         * @Title("Another extended form");
         */
        this.xo = null;
    }
}

describe("FormManager", function() {
    let translateManager = new TranslateManager.class("en");
    let formManager = new FormManager.class(translateManager);

    before(() => {

    });

    it("convert properties should convert a key/value array into a single object", function() {
        const input = [{key:"foo", value:"bar"}, {key:"bar", value:"foo"}];
        const output = formManager.convertProperties(input);
        expect(output.foo).to.be.equal("bar");
        expect(output.bar).to.be.equal("foo");
    });

    it("should register a form", function() {
        formManager.register(BarFoo, "foo", "bar");
        expect(formManager.registeredForms["BarFoo"].class).to.be.equal(BarFoo);
        expect(formManager.registeredForms["BarFoo"].inject.length).to.be.equal(2);
        expect(formManager.registeredForms["BarFoo"].inject[0]).to.be.equal("foo");
        expect(formManager.registeredForms["BarFoo"].inject[1]).to.be.equal("bar");
    });

    it("get extended class should return null", function() {
        expect(formManager.getExtendedClass(BarFoo)).to.be.null;
    });

    it("get extended class should return the extended class", function() {
        expect(formManager.getExtendedClass(Bar)).to.be.equal("Foo");
    });

    after(() => {

    });
});
