class EventTravel {
    x = 0;
    y = 0;

    constructor(evt) {
        this.x = evt.pageX;
        this.y = evt.pageY;
    }

    diff(evt) {
        return {
            x: evt.pageX - this.x,
            y: evt.pageY - this.y
        };
    }

    dist(evt) {
        const travel = this.diff(evt);

        return Math.sqrt(travel.x * travel.x + travel.y * travel.y);
    }
}

export default EventTravel;
