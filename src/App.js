import React, { useState, useRef, useEffect } from 'react';
import './App.css'; // Add your own CSS for styling
import VerticalCustomScrollbar from './VerticalCustomScrollbar'; // Import your custom scrollbar component

const App = () => {
  const [fileContent, setFileContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState([]);
  const textContainerRef = useRef(null);
  const [lineHeight, setLineHight] = useState(12);
  const [topLineNumber, setTopLineNumber] = useState(1);

  useEffect(()=>{
    console.log('matches:', matches);
  }, [matches])

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleSearch = () => {
    if (fileContent && searchTerm) {
      let regex;
      try {
        regex = new RegExp(searchTerm, 'gi');
      } catch (error) {
        console.error(error.message)
      }
      if (!regex) return;
      const matchPositions = [];
      let match;
      const fileContentLines = fileContent.split('\n');
      for (let i=0; i < fileContentLines.length; i++) {
        match = regex.test(fileContentLines[i]);
        if (match) matchPositions.push(i);
      }
      // while ((match = regex.exec(fileContent))) {

      //   matchPositions.push(match.index);
      // }
      setMatches(matchPositions);
      // scrollToMatches();
    } else {
      setMatches([]);
    }
  };

  const handleWheelScroll = (event) => {
    const delta = event.deltaY; // Positive value for scrolling down, negative for scrolling up
    // if (textContainerRef.current) {
    //   textContainerRef.current.scrollTop += delta;
    // }
    setTopLineNumber(topLineNumber => topLineNumber + delta / lineHeight)
  };

  

  return (
    <div className="App">
      <input type="file" onChange={handleFileUpload} />
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <div className='border-container'>
        <div
          id="text-div"
          className="text-container"
          ref={textContainerRef}
          onWheel={handleWheelScroll} 
        >
          <div className='line-numbered ' >
            {fileContent.split("\n").map((line, index) => {
              let classes = ["text"];
              if (matches.includes(index)) {
                classes.push("hilight");
              }
              return (
              <div key={index} className={classes.join(" ")}>
                {line}
              </div>)
          })}
          </div>
        </div>          
        <VerticalCustomScrollbar
          matches={matches}
          totalLines={fileContent.split('\n').length}
          lineHeight={lineHeight}
          topLineNumber={topLineNumber}
          setTopLineNumber={setTopLineNumber}
        />
      </div>
    </div>
  );
};

export default App;

