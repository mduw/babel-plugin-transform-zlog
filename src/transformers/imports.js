import { getSouceMapID } from '../utils/map-utils';
import { name } from '../../package.json';
import { shortenPath } from '../utils/file-utils';

const ModuleResolveCall = ['require'];

function doMapID2ImportUrl(nodePath, fromUrl, state) {
  switch (nodePath.type) {
    case 'ObjectPattern': {
      const properties = nodePath.get('properties');
      for (let i = 0; i < properties.length; i++) {
        doMapID2ImportUrl(properties[i], fromUrl, state);
      }
      break;
    }
    case 'Identifier': {
      const importName = nodePath.node.name;
      const SourceMapID = getSouceMapID(shortenPath(state.normalizedOpts.rootDir, state.currentFile), state.SourceMap);
      state.ImportMap.set(`${importName}:${SourceMapID}`, fromUrl);

      break;
    }

    case 'ObjectProperty': {
      const value = nodePath.get('value').node.name;
      const SourceMapID = getSouceMapID(shortenPath(state.normalizedOpts.rootDir, state.currentFile), state.SourceMap);
      state.ImportMap.set(`${value}:${SourceMapID}`, fromUrl);

      break;
    }
    case 'ImportDefaultSpecifier':
    case 'ImportSpecifier': {
      const SpecifierNode = nodePath.get('local');
      if (SpecifierNode.type === 'Identifier') {
        const value = SpecifierNode.node.name;
        const SourceMapID = getSouceMapID(shortenPath(state.normalizedOpts.rootDir, state.currentFile), state.SourceMap);
        state.ImportMap.set(`${value}:${SourceMapID}`, fromUrl);
      }
      break;
    }
    default: {
      break;
    }
  }
}

function readImportSpecifier(nodePath, state) {
  if (state.VisitedModules.has(nodePath)) {
    return;
  }
  state.VisitedModules.add(nodePath);
  const ParentNode = nodePath.parentPath;
  const SourceNode = ParentNode.get('source');
  const specifiers = nodePath.parentPath.get('specifiers');
  switch (SourceNode.type) {
    case 'StringLiteral': {
      const fromUrl = SourceNode.node.value;

      for (let i = 0; i < specifiers.length; i++) {
        doMapID2ImportUrl(specifiers[i], fromUrl, state);
      }
      break;
    }
    default: {
      throw new Error(`${name} error: invalid import source type`);
    }
  }
}

function readImportDeclarator(nodePath, state) {
  if (state.VisitedModules.has(nodePath)) {
    return;
  }
  state.VisitedModules.add(nodePath);

  const InitNode = nodePath.get('init');
  if (
    InitNode.type === 'CallExpression' &&
    InitNode.get('callee').type === 'Identifier' &&
    ModuleResolveCall.includes(InitNode.get('callee').node.name)
  ) {
    const fromUrl = InitNode.get('arguments.0').node.value;
    // if (!state.normalizedOpts.loggerPathRegex.test(fromUrl)) return; // not logger imports
    const IDNode = InitNode.parentPath.get('id');
    doMapID2ImportUrl(IDNode, fromUrl, state);
  } else if (InitNode.type === 'Identifier') {
    const IDNode = nodePath.get('id');
    const names = state.ImportMap.get(state.currentFile) || [];
    if (IDNode.type === 'Identifier' && !names.includes(IDNode.node.name)) {
      const value = IDNode.node.name;
      const currentSourceMapID = getSouceMapID(shortenPath(state.normalizedOpts.rootDir, state.currentFile), state.SourceMap);
      state.ImportMap.set(
        `${value}:${currentSourceMapID}`,
        state.ImportMap.get(`${InitNode.node.name}:${currentSourceMapID}`)
      );
    }
  }
}

const ImportVisitors = {
  'ImportSpecifier|ImportDefaultSpecifier': readImportSpecifier,
};

const DeclaratorVisitor = {
  VariableDeclarator: readImportDeclarator,
};

export default function checkImports(nodePath, state) {
  if (state.VisitedModules.has(nodePath)) {
    return;
  }
  state.VisitedModules.add(nodePath);

  if (state.types.isImportDeclaration(nodePath.node)) {
    const { scope, node } = nodePath.parentPath;
    scope.traverse(node, ImportVisitors, state);
  } else if (state.types.isVariableDeclaration(nodePath.node)) {
    const { scope, node } = nodePath;
    scope.traverse(node, DeclaratorVisitor, state);
  }
}
