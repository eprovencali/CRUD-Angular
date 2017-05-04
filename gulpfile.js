var gulp = require("gulp");
var uglify = require("gulp-uglify");
var minify = require("gulp-minify-css");
var concat = require("gulp-concat");
// var less = require("gulp-less");
var del = require("del");
var fs = require("fs");
var path = require("path");
var eslint = require("gulp-eslint");
var fsExtra = require("fs-extra");

var dirAplicacao = "."; // Diretório raíz da aplicação
var dirOutputJS = "./assets/js"; // Diretório de destino dos arquivos JS
var dirOutputView = "./views"; // Diretório de destino dos arquivos de View
var dirOutputCSS = "./assets/style"; // Diretório de destino dos arquivos CSS
var dirModulos = "./modulos"; // Diretório onde os módulos estão localizados
var dirNodeModules = "./node_modules"; //Diretório onde os módulos no node estão localizados
var dirOutputAssets = "./assets"; // Diretório dos arquivos de Conteudo

var dirDeploy = "./dist"; // Diretório de deploy
var dirDeployView = "./dist/views"; // Diretório de deploy dos arquivos de View
var dirDeployAssets = "./dist/assets"; // Diretório de deploy dos arquivos de Conteudo

// var nomeAplicacao = JSON.parse(lerArquivo("./package.json")).name;

// Análise estática do eslint
gulp.task("analise-estatica", function () {
    return gulp.src([path.join(dirAplicacao, "**/*.js"), 
                   ("!" + path.join(dirOutputJS, "**")), 
                   ("!" + path.join(dirDeployAssets, "**")), 
                   ("!" + path.join(dirNodeModules, "**"))])
        .pipe(eslint())
        .pipe(eslint.format("checkstyle", function (result) {
            fsExtra.ensureDirSync("reports/lint");
            fs.writeFileSync("reports/lint/results.xml", result);
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// Preparação para compilação
gulp.task("limpar-diretorio-output", ["analise-estatica"], function () {
    del([path.join(dirOutputJS, "**/*.*")]);
});

// Preparação para compilação
gulp.task("limpar-diretorio-output-css", ["analise-estatica"], function () {
    del([path.join(dirOutputCSS, "**/*.*"),("!" + path.join(dirOutputCSS, "**/*.less"))]);
});

// Consolidação das bibliotecas dependentes 
gulp.task("consolidar-dependencias", ["limpar-diretorio-output"], function () {
    return gulp.src([
        path.join(dirNodeModules, "angular/angular.js"),
        path.join(dirNodeModules, "angular-animate/angular-animate.js"),        
        path.join(dirNodeModules, "angular-resource/angular-resource.js"),  
        path.join(dirNodeModules, "angular-route/angular-route.js"),
        path.join(dirNodeModules, "angular-sanitize/angular-sanitize.js"),
        path.join(dirNodeModules, "angular-touch/angular-touch.js"),
        path.join(dirNodeModules, "angular-ui-bootstrap/dist/ui-bootstrap.js"),
        path.join(dirNodeModules, "angular-ui-bootstrap/dist/ui-bootstrap-tpls.js"),
        path.join(dirNodeModules, "underscore/underscore.js"),
        path.join(dirNodeModules, "oclazyload/dist/ocLazyLoad.js"),
        path.join(dirNodeModules, "less/dist/less.js"),
        path.join(dirNodeModules, "angular-input-masks/releases/angular-input-masks-standalone.min.js")
    ])
        .pipe(concat("dependencias.js"))
        // .pipe(uglify())
        .pipe(gulp.dest(dirOutputJS));
});

// Consolidação dos módulos em arquivos únicos para cada um
gulp.task("consolidar-modulos", ["copiar-estilos"], function () {
    var modulos = listarModulos(dirModulos);
    modulos.forEach(function (diretorio) {
        console.log("Consolidar módulo: " + diretorio);
        var nomeArquivo = diretorio + ".js";
        var caminhoModulo = path.join(dirModulos, diretorio);
        gulp.src([path.join(caminhoModulo, "/*.module.js"), path.join(caminhoModulo, "/**/*.js")])
            .pipe(concat(nomeArquivo))
            // .pipe(uglify())
            .pipe(gulp.dest(dirOutputJS));
    });
    return gulp;
});

// Consolidação dos módulos em arquivos únicos para cada um
gulp.task("consolidar-view", ["consolidar-modulos"], function () {
    var modulos = listarModulos(dirModulos);
    modulos.forEach(function (diretorio) {
        console.log("Consolidar views: " + diretorio);

        var nomeArquivo = diretorio + ".html";

        var caminhoModulo = path.join(dirModulos, diretorio);

        gulp.src([path.join(caminhoModulo, "/views/*.html")])
            .pipe(concat(nomeArquivo))
            // .pipe(uglify())
            .pipe(gulp.dest(dirOutputView));
    });

    return gulp;
});

gulp.task("copiar-estilos-base", ["consolidar-dependencias"], function () {
    return gulp.src([
        path.join(dirNodeModules, "angular-material/angular-material.css"),
        path.join(dirNodeModules, "/bootstrap/dist/css/bootstrap.css"),
        path.join(dirNodeModules, "angular-ui-bootstrap/dist/ui-bootstrap-csp.css")        
    ])
        .pipe(concat("dependencias.css"))
        // .pipe(uglify())
        .pipe(gulp.dest(dirOutputCSS));
});


gulp.task("copiar-estilos", [
    "copiar-estilos-base"
]);

//Task build
gulp.task("build", [
    "analise-estatica",
    "limpar-diretorio-output",
    "limpar-diretorio-output-css",
    "consolidar-dependencias",
    "copiar-estilos",
    "consolidar-modulos",
    "consolidar-view"
]);

gulp.task("watch", ["build"], function () {
    gulp.watch([dirModulos + "/**/*.*"], ["build"]);
});

//Task ddefault
gulp.task("default", ["build"]);


var listarModulos = function (caminhoDiretorio_) {
    return fs.readdirSync(caminhoDiretorio_).filter(function (arquivo) {
        return fs.statSync(path.join(caminhoDiretorio_, arquivo)).isDirectory();
    });
};

// function lerArquivo(caminhoArquivo_) {
//     return fs.readFileSync(caminhoArquivo_);
// }

// Preparação para deploy
gulp.task("limpar-diretorio-deploy-assets", function () {
    del([path.join(dirDeployAssets, "**/*.*")]);
});

gulp.task("limpar-diretorio-deploy-view", ["limpar-diretorio-deploy-assets"], function () {
    del([path.join(dirDeployView, "**/*.*")]);
});

gulp.task("copiar-index", ["limpar-diretorio-deploy-view"], function () {    
    return gulp.src([path.join(dirAplicacao, "index.html")])
        .pipe(gulp.dest(dirDeploy));
});

gulp.task("copiar-view", ["limpar-diretorio-deploy-view"], function () {    
    return gulp.src([path.join(dirOutputView, "*.html")])
        .pipe(gulp.dest(dirDeployView));
});

gulp.task("copiar-conteudo-data", ["limpar-diretorio-deploy-assets"], function () {    
    return gulp.src([path.join(dirOutputAssets, "data/*.*")])
        .pipe(gulp.dest(path.join(dirDeployAssets, "data/")));
});

gulp.task("copiar-conteudo-fonts", ["limpar-diretorio-deploy-assets"], function () {    
    return gulp.src([path.join(dirOutputAssets, "fonts/*.*")])
        .pipe(gulp.dest(path.join(dirDeployAssets, "fonts/")));
});

gulp.task("copiar-conteudo-images", ["limpar-diretorio-deploy-assets"], function () {    
    return gulp.src([path.join(dirOutputAssets, "images/**/*")])
        .pipe(gulp.dest(path.join(dirDeployAssets, "images/")));
});

gulp.task("copiar-conteudo-js", ["limpar-diretorio-deploy-assets"], function () {    
    return gulp.src([path.join(dirOutputAssets, "js/*.*")])
        .pipe(uglify())
        .pipe(gulp.dest(path.join(dirDeployAssets, "js/")));
});

gulp.task("copiar-conteudo-estilo", ["limpar-diretorio-deploy-assets"], function () {    
    return gulp.src([path.join(dirOutputAssets, "style/*.css")])
        .pipe(minify())
        .pipe(gulp.dest(path.join(dirDeployAssets, "style/")));
});

gulp.task("copiar-conteudo-estilo-less", ["limpar-diretorio-deploy-assets"], function () {    
    return gulp.src([path.join(dirOutputAssets, "style/*.less")])
        // .pipe(less())
        .pipe(gulp.dest(path.join(dirDeployAssets, "style/")));
});


//Task build
gulp.task("deploy", [
    "limpar-diretorio-deploy-assets",
    "limpar-diretorio-deploy-view",
    "copiar-index",
    "copiar-view",
    "copiar-conteudo-data",
    "copiar-conteudo-fonts",
    "copiar-conteudo-images",
    "copiar-conteudo-js",
    "copiar-conteudo-estilo",
    "copiar-conteudo-estilo-less"  
]);