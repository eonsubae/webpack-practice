import HelloWorldButton from './components/hello-world-button/hello-world-button';
import Heading from './components/heading/Heading';
import React from 'react';

const heading = new Heading();
heading.render('hello world');
const helloWorldButton = new HelloWorldButton();
helloWorldButton.render();
