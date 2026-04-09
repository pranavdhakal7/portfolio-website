import React from 'react';
import './App.css';
import './styles/About.css';
import './styles/Skills.css';
import './styles/Education.css';
import './styles/Work.css';
import './styles/Experience.css';
import './styles/Contact.css';
import './styles/Footer.css';
import './styles/Awards.css';
import './styles/ScrollObserver.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Skills from './components/Skills';
import Education from './components/Education';
import Awards from './components/Awards';
import Work from './components/Work';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollObserver from './components/ScrollObserver';
import Abstract3DShapes from './components/Abstract3DShapes';
import CustomCursor from './components/CustomCursor';
import Cat from './components/Cat';
import Pet from './components/Pet';
import './styles/Cursor.css';
import { Analytics } from "@vercel/analytics/react";

function App() {

    return (
                <div className="App">
                    <CustomCursor />
                    <Abstract3DShapes />
                    <Navbar />
                    <ScrollObserver>
                        <Home id="home" />
                        <About id="about" />
                        <Skills id="skills" />
                        <Education id="education" />
                        <Work id="work" />
    {/* Awards and Contact in same screen when scrolled */}
                <div id="awards-contact-screen" className="combined-section">
                            <Awards id="awards" />
                            <Contact id="contact" />
        </div>
                    <Footer />
        </ScrollObserver>
                <Cat />
                    <Pet />
                    <Analytics />
        </div>
        );
}

export default App;
