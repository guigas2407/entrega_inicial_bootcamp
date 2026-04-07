module.exports = [
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                console: "readonly",
                require: "readonly",
                module: "readonly",
                process: "readonly",
                describe: "readonly",
                test: "readonly",
                expect: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
            "no-undef": "off" 
        }
    }
];