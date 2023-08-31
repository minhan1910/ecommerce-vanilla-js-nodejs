const Rating = {
  renderStart: (voteValue, ...bound) => {
    const [ firstBound, secondBound ] = bound;
    
    if (voteValue >= secondBound) {
        return 'fa fa-star'
    }

    if (voteValue >= firstBound) {
        return 'fa fa-star-half-o'
    }

    return 'fa fa-star-o'    
  },
  render: function(props) {
    if (!props.value) {
      return `<div></div>`;
    }

    return `
        <div class="rating">
            <span>
                <i class="${this.renderStart(props.value, 0.5, 1)}"></i>
            </span>
            <span>
                <i class="${this.renderStart(props.value, 1.5, 2)}"></i>
            </span>
            <span>
                <i class="${this.renderStart(props.value, 2.5, 3)}"></i>
            </span>
            <span>
                <i class="${this.renderStart(props.value, 3.5, 4)}"></i>
            </span>
            <span>
                <i class="${this.renderStart(props.value, 4.5, 5)}"></i>
            </span>
            <span> ${props.text || ''} </span>
        </div>
    `
  },
};

export default Rating;
