import React, { useEffect, useRef, useState } from "react";
// import ReactDOM from "react-dom";
import ReactDOM from 'react-dom/client';
import Globe from "react-globe.gl";
import './index.css'
import airportsRaw from './airports.json'
import countries from './ne_110m_admin_0_countries.json'
import * as THREE from '../node_modules/three/build/three.module.js'

const r = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

countries.features.map(c => {c, c.color = `#${r([0,1,2])}${r([5,6,7])}${r([1,2,3])}`})

const screenH = window.innerHeight;
const screenW = window.innerWidth;

function App() {
  const globeRef = useRef();
  const [airports, setAirports] = useState(airportsRaw)
  const [hints, setHints] = useState(0)
  const [point, setPoint] = useState()
  const [flights, setFlights] = useState()
  const sway = useRef([0, 0])
  const timer = useRef(0)
  const [gui, setGui] = useState([])
  const [score, setScore] = useState()
  const [label, setLabel] = useState()
  const [msg, setMsg] = useState([])
  const [ans, setAns] = useState()

  const guiArray = (key, pt) => {
    const guis = {
      win: [
        <div className="gui">
          <h1>Bravo!</h1>
          <h2>You correctly identified the airport as <span>{pt.iata}</span></h2>
          <h3>{pt.name}</h3>
        </div>
      ],
      loss: [
        <div className="gui">
          <h1>Unlucky!</h1>
          <h2>The airport was <span>{pt.iata}</span></h2>
          <h3>{pt.name}</h3>
        </div>
      ]
    }
    if (guis.hasOwnProperty(key)) {
      return guis[key];
    } else {
      return null;
    }
  }

  const getQ = () => {
    const unanswered = [...airports].filter(ap => !ap.answered);
    const n = Math.floor(Math.random() * unanswered.length);
    setHints(0);
    setPoint({...unanswered[n]});
  }

  const guess = (e) => {
    if (e.key !== 'Enter' || e.target.value.length < 3) return;
    setAns(e.target.value.toUpperCase());
    e.target.value = "";
    e.target.focus()
  }

  const correct = () => {
    const tempMsg = [...msg]
    tempMsg[0] = <div className={"oneRow"}>{tempMsg[0]}<span className={"correct"}>{ans}</span></div>

    setMsg(p => [<br/>, <br/>, <div className={"oneRow"}><span className={"correct"}>Correct!</span><span> It was {point.name} ({point.iata}).</span></div>,  tempMsg])

    setAirports(prevAirports => {
      return prevAirports.map(ap => {
        if (ap.iata === point.iata) {
          return { ...ap, answered: true, correct: true };
        }
        return ap;
      });
    });

    getQ();
  }

  const wrong = () => {
    if (hints > 2) {
      giveUp()
      return;
    }
    setHints(hints+1)
  }

  const giveUp = () => {
    // setGui(guiArray.loss)

    setMsg(p => [<br/>, <br/>, <div className={"oneRow"}><span className={"wrong"}>Incorrect!</span><span> It was {point.name} ({point.iata}).</span></div>, ...p])

    setAirports(prevAirports => {
      return prevAirports.map(ap => {
        if (ap.iata === point.iata) {
          return { ...ap, answered: true, correct: false };
        }
        return ap;
      });
    });

    getQ();
  }

  const getFlights = () => {
    const dests = airports.filter(ap => (
      ap.iata !== point.iata && 
      ap.state !== point.state && 
      ap.city !== point.city
    )).map(ap => ({
      startLat: point.lat,
      startLng: point.lng,
      endLat: ap.lat,
      endLng: ap.lng,
      color: ['#00000000', "#ffffa0", '#ffffaf88', "#ffffa044", '#00000000'],
      opacity: 0.5
    }));
    
    setFlights(dests)
    
    // if (!("destinations" in point)) return;
    // setFlights([...Array.from(point.destinations.map(code => {
    //   var airport = airports.find(ap => ap.iata == code);
    //   if (airport !== undefined) {
    //     return {
    //       startLat: point.lat,
    //       startLng: point.lon,
    //       endLat: airport.lat,
    //       endLng: airport.lon,
    //       color: ['#00000000', "#ffffaf", '#00000000'],
    //       opacity: 0.5
    //     }
    //   } 
    // }))])
  }

  useEffect(() => {
    if (!point || !ans) return;
    if (ans === point.iata.toUpperCase()) {
      correct();
    } else {
      wrong();
    }
  }, [ans])

  useEffect(() => {
    const newLbl = hints<1? "":
    `
      <p>Country: ${point.country}</p>
      ${hints<2?"":
        `<p>City: ${point.city}</p>`
      }
      ${hints<3?"":
        `<p>Name: ${point.name}</p>`
      }
    `
    setLabel(newLbl)

    if (hints<1) return;
    const newMsg = hints<2?`It's in ${point.country} if that helps.`:hints<3?`It's in ${point.city}.`:`It's called ${point.name}`;
    const tempMsg = [...msg];
    tempMsg[0] = <div className="oneRow">{tempMsg[0]}<span className={"wrong"}>{ans}</span></div>
    setMsg(p => [<span>That's not it. {newMsg}</span>, tempMsg])
  }, [hints])

  useEffect(() => {
    if (!flights || flights.length < 0) return;
    globeRef.current.pointOfView({lat: (Math.abs(point.lat) + 20) * (point.lat/Math.abs(point.lat)), lng: point.lng, altitude: 2})
    
    var lights = [...globeRef.current.lights()];
    lights[0].intensity = 2.5;
    lights[1].intensity = 8;
    lights[1].position.set(...globeRef.current.camera().position);
    lights[1].color.set('#fff');
    globeRef.current.lights(lights)  

    globeRef.current.pointOfView({lat: (Math.abs(point.lat) - 10) * (point.lat/Math.abs(point.lat)), lng: point.lng, altitude: 2})
  }, [flights])

  useEffect(() => {
    setScore(airports.filter(ap => ap.correct).length + "/" + airports.filter(a => a.answered).length)
    if (point === undefined) return;
    getFlights()
    setMsg(p => [<span>What's this airport's IATA code?</span>, ...p])
  }, [point])

  useEffect(() => {
    console.log(msg)
  }, [msg])
  
  useEffect(() => {
    getQ();

    setInterval(() => {
      timer.current = (timer.current+0.01) % 360;
      sway.current = [Math.cos(timer.current), Math.sin(timer.current)]
      var pov = globeRef.current.pointOfView()
      globeRef.current.pointOfView({lat: +pov.lat + (sway.current[0]/20), lng: +pov.lng + (sway.current[0]/20), altitude: pov.altitude})
    }, 70);

    return () => clearInterval(interval);
  }, [])

  return <div className="app">
    {flights && point?
      <Globe
        ref={globeRef}
        animateIn = {false}
        width={0.5 * screenW}
        // height={0.9 * screenH}
        // backgroundColor="#000500"
        backgroundColor="#000"

        // globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
        globeMaterial={new THREE.MeshPhongMaterial({color: 0x000227, shininess: 1})}

        polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
        polygonAltitude={0.005}
        polygonCapMaterial={feat => new THREE.MeshPhongMaterial({color: feat.color, shininess: 5})}
        polygonSideColor={feat => "#00000000"}
        
        labelsData={airports}
        labelText={a => ""}
        labelColor={ap => ap.iata===point.iata?'#ff9':ap.answered?ap.correct?'#0f0':'#f00':'#788'}
        labelDotRadius={ap => ap.iata===point.iata?0.2:0.12}
        labelAltitude={0.01}

        htmlElementsData={(hints < 1)?[]:[point]}
        htmlAltitude={0.02}
        htmlSize={pt => 1}
        htmlLat={pt => point.lat}
        htmlLng={pt => point.lng}
        htmlElement={d => {
          const el = document.createElement('div');
          el.innerHTML = label;
          el.style.color = "white";
          el.style.backgroundColor = "#00000055";
          el.style.borderRadius = "5px";
          el.style.padding = "5px";
          el.style.width = `${d.size}px`;
    
          el.style['pointer-events'] = 'auto';
          el.style.cursor = 'pointer';
          el.onclick = () => console.info(d);
          return el;
        }}

        arcsData={flights}
        arcColor={'color'}
        arcDashLength={() => 0.4 + Math.random() * 0.3}
        arcDashInitialGap={() => Math.random() * 3}
        arcDashGap={() => Math.random() + 1}
        arcDashAnimateTime={() => Math.random() * 3000 + 7000}
        arcAltitudeAutoScale={0.3}
      />:null
    }

    {/* <input type="text" autoFocus={true} maxLength={3} onKeyUp={guess} /> */}
    <div className="gds">
      <div className="screen">
        {msg.map(txt => {
          return txt;
        })}
      </div>
      <span className="gt">&gt;</span>
      <input type="text" autoFocus={true} maxLength={3} onKeyUp={guess} />
    </div>
    
    {gui? gui.map(ele => {
      return ele;
    }):null}
    
    {score?<p className="score">
      {score}
    </p>:null}
  </div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
