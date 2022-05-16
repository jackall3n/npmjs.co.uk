module.exports = {
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                urban: '#1D2439',
                npm: '#cb3837'
            },
            fontFamily: {
                npm: "'Source Sans Pro', 'Lucida Grande', sans-serif",
                urban: '"Lora", Georgia, Cambria, "Times New Roman", Times, serif'
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
