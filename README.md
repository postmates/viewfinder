# viewfinder
Allow users to select an image and crop it inline, removing user confusion when the image is later served and freeing up those precious cycles on the backend

## Demo
![alt text](https://raw.githubusercontent.com/postmates/viewfinder/master/demo.gif "For the visually inclined")

## Usage
```
npm install --save viewfinder
```
```Javascript
import Viewfinder from 'viewfinder';

if (process.env.BROWSER) {
    require('viewfinder/dist/viewfinder.css');
}

class App extends React.Component {
    save() {
        // the first export parameter will scale the
        // image in the DOM by this much before exporting
        this.image.export(1.25, function(png) {
            // send the png file to the server
        });
    }

    render() {
        return (
            <Viewfinder
                ref={ (c) => this.image = c.image }
                scale={ 0.5 } />
            <Button onClick={ this.save.bind(this) }>
                Save
            </Button>
        );
    }
}

export default App;
```
