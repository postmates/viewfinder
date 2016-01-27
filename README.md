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
        // the first parameter will scale the image in
        // the DOM by this much before exporting
        this.image.out(1.25, function(png) {
            // lets download it
            const a = document.createElement("a");
            a.style.display = "none";
            document.body.appendChild(a);

            a.href = window.URL.createObjectURL(blob);
            a.download = 'cropped-image.png';
            a.click();
            window.URL.revokeObjectURL(url);
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
