import React from 'react';
import '../styles/InstructionsContent.css';

const InstructionsContent: React.FC = () => {
  return (
    <div className="instructions-content">
      <h3>How to Play</h3>
      <p className="instructions-intro">
        Match the valve combination for each pitch shown on screen. 
        You have three ways to play:
      </p>
      
      <div className="instruction-methods">
        <div className="instruction-method">
          <div className="method-icon">🖱️</div>
          <div className="method-details">
            <h4>Mouse/Trackpad</h4>
            <p>Click the valve buttons (1, 2, 3) to select them, then click <strong>Submit</strong></p>
          </div>
        </div>
        
        <div className="instruction-method">
          <div className="method-icon">⌨️</div>
          <div className="method-details">
            <h4>Keyboard</h4>
            <p>Press <kbd>J</kbd>, <kbd>K</kbd>, <kbd>L</kbd> keys for valves 1, 2, 3</p>
            <p>Press <kbd>Spacebar</kbd> to submit</p>
          </div>
        </div>
        
        <div className="instruction-method">
          <div className="method-icon">👆</div>
          <div className="method-details">
            <h4>Touchscreen</h4>
            <p>Tap the valve buttons to select them, then tap <strong>Submit</strong></p>
          </div>
        </div>
      </div>
      
      <div className="instruction-tip">
        <strong>💡 Tip:</strong> Hold down keyboard keys or keep buttons pressed while you submit!
      </div>
    </div>
  );
};

export default InstructionsContent;

