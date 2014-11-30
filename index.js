var fs = require('fs'),
    request = require('request'),
    gm = require('gm'),
    app = require('express')(),
    http = require('http').Server(app);

// Uncomment to use ImageMagick instead of GraphicsMagick
// gm = gm.subClass({imageMagick: true});

// Ensure temp folder exists
var folder = 'temp';
if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
}

// Handle all endpoints
// Parameters:
//  i - URL of the image to be processed
//  s - Size (in pixels) of the outputted image, default is 500
//  r - Radius (in pixels) of blur effect, default is 20
//  q - Quality (in percentage) of the outputted image, default is 80
//  f - If this parameter is set, cache will be bypassed
app.get('*', function(req, res) {
    var url = req.query.i,
        size = req.query.s || 500,
        radius = req.query.r || 20,
        quality = req.query.q || 80,
        force = req.query.f !== undefined;

    // Check for URL
    if (!url) {
        console.warn('Error: Missing url parameter');
        res.sendStatus(500);
        return;
    }

    // Prepare file information
    var name = url.split('/').pop(),
        ext = name.split('.').pop(),
        path = folder + '/' + 's' + size + 'r' + radius + 'q' + quality + '-' + name,
        headers = {'Content-Type': 'image/'+ext.replace('jpg', 'jpeg')};

    // Check for valid file type
    if (['png', 'gif', 'jpg', 'jpeg'].indexOf(ext) === -1) {
        console.warn('Error: Wrong image type for', url);
        res.sendStatus(500);
        return;
    }

    // Unless forced, check cache for image
    if (!force && fs.existsSync(path)) {
        var stats = fs.statSync(path);
        // Check whether file is over an hour old
        if (stats.ctime.getTime() > (new Date().getTime() - 60 * 60 * 1000)) {
            // Serve the image
            var file = fs.readFileSync(path);
            res.writeHead(200, headers);
            res.end(file, 'binary');
            return;
        }
    }

    // Download the image
    request(url)
        .pipe(fs.createWriteStream(path))
        .on('close', function () {
            try {
                // Resize and blur image
                gm(path)
                    .resize(size)
                    .blur(0, radius)
                    .quality(quality)
                    .write(path, function (err) {
                        if (err) {
                            console.warn('Error:', err);
                            res.sendStatus(500);
                            return;
                        }
                        // Serve the image
                        var file = fs.readFileSync(path);
                        res.writeHead(200, headers);
                        res.end(file, 'binary');
                    });
            } catch (err) {
                console.warn('Error:', err);
                res.sendStatus(500);
                return;
            }
        });
});

http.listen(3000);