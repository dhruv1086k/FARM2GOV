const keys = {
    en: {
        welcome: 'Welcome to Farm2Gov',
        login: 'Login',
        signup: 'Signup',
        policies: 'Policies'
    },
    hi: {
        welcome: 'फार्म2गव में आपका स्वागत है',
        login: 'लॉगिन',
        signup: 'साइनअप',
        policies: 'नीतियाँ'
    }
};

export function t(lang = 'en', key) {
    return keys[lang]?.[key] || keys['en'][key] || key;
}

export default keys;
