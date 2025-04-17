import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { placeShip } from '../store/gameSlice';
import './ShipPlacement.css';

const ShipPlacement = () => {
  const dispatch = useDispatch();
  const { playerShips } = useSelector(state => state.game);
  const [selectedShip, setSelectedShip] = useState(null);
  const [isVertical, setIsVertical] = useState(false);

  const handleShipSelect = (ship) => {
    if (ship.placed) return;
    setSelectedShip(ship);
    dispatch(placeShip({ ship: ship.name, orientation: isVertical ? 'vertical' : 'horizontal' }));
  };

  const handleOrientationToggle = () => {
    setIsVertical(!isVertical);
    if (selectedShip) {
      dispatch(placeShip({ ship: selectedShip.name, orientation: !isVertical ? 'vertical' : 'horizontal' }));
    }
  };

  return (
    <div className="ship-placement">
      <h2>Place Your Ships</h2>
      <div className="ship-selection">
        {playerShips.map((ship) => (
          <div
            key={ship.name}
            className={`ship-option ${ship.placed ? 'placed' : ''} ${selectedShip?.name === ship.name ? 'selected' : ''}`}
            onClick={() => handleShipSelect(ship)}
          >
            {ship.name} ({ship.size})
          </div>
        ))}
      </div>
      <button onClick={handleOrientationToggle}>
        {isVertical ? 'Vertical' : 'Horizontal'}
      </button>
      {selectedShip && (
        <div className="placement-instructions">
          Click on your board to place your {selectedShip.name}
        </div>
      )}
    </div>
  );
};

export default ShipPlacement; 