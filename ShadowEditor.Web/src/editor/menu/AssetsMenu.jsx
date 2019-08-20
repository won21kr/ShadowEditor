import { PropTypes, MenuItem, MenuItemSeparator } from '../../third_party';
import StringUtils from '../../utils/StringUtils';

/**
 * 资源菜单
 * @author tengge / https://github.com/tengge1
 */
class AssetsMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleExportGeometry = this.handleExportGeometry.bind(this);
        this.handleExportObject = this.handleExportObject.bind(this);
        this.handleExportGLTF = this.handleExportGLTF.bind(this);
        this.handleExportOBJ = this.handleExportOBJ.bind(this);
        this.handleExportPLY = this.handleExportPLY.bind(this);
        this.handleExportSTLB = this.handleExportSTLB.bind(this);
        this.handleExportSTL = this.handleExportSTL.bind(this);
    }

    render() {
        return <MenuItem title={_t('Assets')}>
            <MenuItem title={_t('Export Geometry')} onClick={this.handleExportGeometry}></MenuItem>
            <MenuItem title={_t('Export Object')} onClick={this.handleExportObject}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={_t('Export GLTF')} onClick={this.handleExportGLTF}></MenuItem>
            <MenuItem title={_t('Export OBJ')} onClick={this.handleExportOBJ}></MenuItem>
            <MenuItem title={_t('Export PLY')} onClick={this.handleExportPLY}></MenuItem>
            <MenuItem title={_t('Export STL Binary')} onClick={this.handleExportSTLB}></MenuItem>
            <MenuItem title={_t('Export STL')} onClick={this.handleExportSTL}></MenuItem>
        </MenuItem>;
    }

    // ------------------------------- 导出几何体 ----------------------------------------

    handleExportGeometry() {
        var editor = app.editor;

        var object = editor.selected;

        if (object === null) {
            app.toast(_t('Please select object!'));
            return;
        }

        var geometry = object.geometry;

        if (geometry === undefined) {
            app.toast(_t('The object you selected is not geometry.'));
            return;
        }

        var output = geometry.toJSON();

        try {
            output = JSON.stringify(output, parseNumber, '\t');
            output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
        } catch (e) {
            output = JSON.stringify(output);
        }

        StringUtils.saveString(output, 'geometry.json');
    }

    // ------------------------------- 导出物体 ------------------------------------------

    handleExportObject() {
        var editor = app.editor;

        var object = editor.selected;

        if (object === null) {
            app.toast(_t('Please select object!'));
            return;
        }

        var output = object.toJSON();

        try {
            output = JSON.stringify(output, parseNumber, '\t');
            output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
        } catch (e) {
            output = JSON.stringify(output);
        }

        StringUtils.saveString(output, 'model.json');
    }

    // ------------------------------ 导出gltf文件 ----------------------------------------

    handleExportGLTF() {
        app.require('GLTFExporter').then(() => {
            var exporter = new THREE.GLTFExporter();

            exporter.parse(app.editor.scene, function (result) {
                StringUtils.saveString(JSON.stringify(result), 'model.gltf');
            });
        });
    }

    // ------------------------------ 导出obj文件 -----------------------------------------

    handleExportOBJ() {
        var editor = app.editor;

        var object = editor.selected;

        if (object === null) {
            app.toast(_t('Please select object!'));
            return;
        }

        app.require('OBJExporter').then(() => {
            var exporter = new THREE.OBJExporter();
            StringUtils.saveString(exporter.parse(object), 'model.obj');
        });
    }

    // ------------------------------- 导出ply文件 ----------------------------------------

    handleExportPLY() {
        var editor = app.editor;

        var object = editor.selected;

        if (object === null) {
            app.toast(_t('Please select object!'));
            return;
        }

        app.require('PLYExporter').then(() => {
            var exporter = new THREE.PLYExporter();
            StringUtils.saveString(exporter.parse(object, {
                excludeAttributes: ['normal', 'uv', 'color', 'index']
            }), 'model.ply');
        });
    }

    // ------------------------------- 导出stl二进制文件 -----------------------------------

    handleExportSTLB() {
        var editor = app.editor;

        app.require('STLBinaryExporter').then(() => {
            var exporter = new THREE.STLBinaryExporter();
            StringUtils.saveString(exporter.parse(editor.scene), 'model.stl');
        });
    }

    // ------------------------------- 导出stl文件 -----------------------------------------

    handleExportSTL() {
        var editor = app.editor;

        app.require('STLExporter').then(() => {
            var exporter = new THREE.STLExporter();
            StringUtils.saveString(exporter.parse(editor.scene), 'model.stl');
        });
    }
}

export default AssetsMenu;