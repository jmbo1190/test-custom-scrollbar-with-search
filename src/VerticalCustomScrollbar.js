import React, { useEffect, useState } from 'react';

const VerticalCustomScrollbar = ({ matches, totalLines, lineHeight, topLineNumber, setTopLineNumber }) => {

  const [ thumbHeight, setThumbHeight ] = useState(10);
  const [ thumbTop, setThumbTop ] = useState(0);
  const [isThumbDragging, setIsThumbDragging] = useState(false);
  const [thumbStartPosition, setThumbStartPosition] = useState(0);
  const [thumbStartLine, setThumbStartLine] = useState(null);

  useEffect(() => {
    const textDiv = document.getElementById('text-div');
    const visibleLines = textDiv.clientHeight / lineHeight;
    textDiv.scrollTop = (topLineNumber - 1) * lineHeight;
  
    const thumbHeight = Math.max((visibleLines / totalLines) * textDiv.clientHeight, 5);
    const thumbPosition = ((topLineNumber - 1) / (totalLines - visibleLines)) * (textDiv.clientHeight - thumbHeight);
    console.log('thumbHeight:', thumbHeight, ', thumbPosition:', thumbPosition);
    setThumbHeight(thumbHeight);
    setThumbTop(thumbPosition)

  }, [lineHeight, totalLines, topLineNumber]); 

  const handleMouseDown = (e) => {
    e.stopPropagation()
    setIsThumbDragging(true);
    setThumbStartPosition(e.clientY);
    setThumbStartLine(topLineNumber);
    console.log('START Dragging from pos:', e.clientY);
  };

  const handleMouseMove = (e) => {
    e.stopPropagation()
    if (!isThumbDragging) return;
    const deltaY = e.clientY - thumbStartPosition;
    const textDiv = document.getElementById('text-div');
    const deltaLines = Math.round(deltaY * totalLines / textDiv.clientHeight);
    const goToLineNum = thumbStartLine + deltaLines;
    console.log("MOVE deltaY:", deltaY, ', deltaLines:', deltaLines);
    console.log('goToLineNum:', goToLineNum, ' of totalLines:', totalLines, ' i.e. ', 100 * goToLineNum / totalLines, '%');
    setTopLineNumber(goToLineNum);
  };

  const handleMouseUp = (e) => {
    e.stopPropagation()
    setTimeout(() => {setIsThumbDragging(false)}, 200);
  };

  const handleMouseLeave = (e) => {
    e.stopPropagation()
    setTimeout(() => {setIsThumbDragging(false)}, 200);
  };


  const handleCustomScrollbarClick = (e) => {
    e.stopPropagation();
    // if (isThumbDragging) return;
    const textDiv = document.getElementById('text-div');
    const clickedY = e.clientY - textDiv.getBoundingClientRect().top;
    const goToLineNum = clickedY * totalLines / textDiv.clientHeight;
    console.log('goToLineNum:', goToLineNum, ' of totalLines:', totalLines, ' i.e. ', 100 * goToLineNum / totalLines, '%');
    setTopLineNumber(goToLineNum);
  }

  const segments = matches.map(match => {
    const percent = (match / totalLines) * 100;
    return (
      <div
        key={match}
        className="search-match-segment-vertical"
        style={{ 
          top: `${percent}%`,
        }}
      />
    );
  });

  return (
    <div 
      className="vertical-custom-scrollbar" 
      onClick={handleCustomScrollbarClick}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}         
      >
        <div className="scrollbar-track">
          {segments}   
          <div 
            className="scrollbar-thumb" 
            style={{
              height: `${thumbHeight}px`, 
              top: `${thumbTop}px`,
              // cursor: isThumbDragging ? 'grabbing' : 'grab',
            }}
            />
        </div>       
    </div>
  );
};

export default VerticalCustomScrollbar;
