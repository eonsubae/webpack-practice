import './heading.scss';

class Heading {
    render(pageName) {
        const h1 = document.createElement('h1');
        const body = document.querySelector('body');
<<<<<<< HEAD
        h1.innerHTML = 'Webpack is awesome. This is "' + pageName + '"page';
=======
        h1.innerHTML = 'Webpack is awesome. This is "' + pageName + '" page';
>>>>>>> starting-point-for-use-cases
        body.appendChild(h1);
    }
}

export default Heading;
