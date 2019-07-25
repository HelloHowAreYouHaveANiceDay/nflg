/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "39b878cd35812d959121";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function(moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function(moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function(moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function(moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				"[HMR] Consider using the NamedModulesPlugin for module names."
			);
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function(level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function(level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function(level) {
	logLevel = level;
};

module.exports.formatError = function(err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!**********************************!*\
  !*** (webpack)/hot/poll.js?1000 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function(updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(/*! ./log-apply-result */ "./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function(err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}

/* WEBPACK VAR INJECTION */}.call(this, "?1000"))

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(/*! dotenv */ "dotenv").config();
__webpack_require__(/*! reflect-metadata */ "reflect-metadata");
const graphql_yoga_1 = __webpack_require__(/*! graphql-yoga */ "graphql-yoga");
const type_graphql_1 = __webpack_require__(/*! type-graphql */ "type-graphql");
// import { GameDetailsResolver } from './resolvers/GameDetailResolver';
// import {GameResolver } from
const AggGameStatResolver_1 = __importDefault(__webpack_require__(/*! ./resolvers/AggGameStatResolver */ "./src/resolvers/AggGameStatResolver.ts"));
const PlayerResolver_1 = __importDefault(__webpack_require__(/*! ./resolvers/PlayerResolver */ "./src/resolvers/PlayerResolver.ts"));
const GameResolver_1 = __importDefault(__webpack_require__(/*! ./resolvers/GameResolver */ "./src/resolvers/GameResolver.ts"));
const nflgame_1 = __importDefault(__webpack_require__(/*! ./nflgame/nflgame */ "./src/nflgame/nflgame.ts"));
nflgame_1.default.getInstance(process.env.CACHE_PATH);
// // GRAPHQL PORTION
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = yield type_graphql_1.buildSchema({
            resolvers: [AggGameStatResolver_1.default, PlayerResolver_1.default, GameResolver_1.default],
            validate: false,
            emitSchemaFile: true
        });
        const server = new graphql_yoga_1.GraphQLServer({
            schema
        });
        server.start(() => console.log("Server is running on http://localhost:4000"));
    });
}
bootstrap();
// nflGame.getInstance().searchSchedule({home: 'NYG', year: 2011}).then((result) => {
//     console.log(result);
// })
// HRM
if (true) {
    module.hot.accept();
    module.hot.dispose(() => console.log("Module disposed. "));
}
// class Nflgame {
//     teams = [
//         ['ARI', 'Arizona', 'Cardinals', 'Arizona Cardinals'],
//         ['ATL', 'Atlanta', 'Falcons', 'Atlanta Falcons'],
//         ['BAL', 'Baltimore', 'Ravens', 'Baltimore Ravens'],
//         ['BUF', 'Buffalo', 'Bills', 'Buffalo Bills'],
//         ['CAR', 'Carolina', 'Panthers', 'Carolina Panthers'],
//         ['CHI', 'Chicago', 'Bears', 'Chicago Bears'],
//         ['CIN', 'Cincinnati', 'Bengals', 'Cincinnati Bengals'],
//         ['CLE', 'Cleveland', 'Browns', 'Cleveland Browns'],
//         ['DAL', 'Dallas', 'Cowboys', 'Dallas Cowboys'],
//         ['DEN', 'Denver', 'Broncos', 'Denver Broncos'],
//         ['DET', 'Detroit', 'Lions', 'Detroit Lions'],
//         ['GB', 'Green Bay', 'Packers', 'Green Bay Packers', 'GNB'],
//         ['HOU', 'Houston', 'Texans', 'Houston Texans'],
//         ['IND', 'Indianapolis', 'Colts', 'Indianapolis Colts'],
//         ['JAC', 'Jacksonville', 'Jaguars', 'Jacksonville Jaguars', 'JAX'],
//         ['KC', 'Kansas City', 'Chiefs', 'Kansas City Chiefs', 'KAN'],
//         ['LA', 'Los Angeles', 'Rams', 'Los Angeles Rams', 'LAR'],
//         ['SD', 'San Diego', 'Chargers', 'San Diego Chargers', 'SDG'],
//         ['LAC', 'Los Angeles C', 'Chargers', 'Los Angeles Chargers', 'LAC'],
//         ['MIA', 'Miami', 'Dolphins', 'Miami Dolphins'],
//         ['MIN', 'Minnesota', 'Vikings', 'Minnesota Vikings'],
//         ['NE', 'New England', 'Patriots', 'New England Patriots', 'NWE'],
//         ['NO', 'New Orleans', 'Saints', 'New Orleans Saints', 'NOR'],
//         ['NYG', 'New York G', 'Giants', 'New York Giants'],
//         ['NYJ', 'New York J', 'Jets', 'New York Jets'],
//         ['OAK', 'Oakland', 'Raiders', 'Oakland Raiders'],
//         ['PHI', 'Philadelphia', 'Eagles', 'Philadelphia Eagles'],
//         ['PIT', 'Pittsburgh', 'Steelers', 'Pittsburgh Steelers'],
//         ['SEA', 'Seattle', 'Seahawks', 'Seattle Seahawks'],
//         ['SF', 'San Francisco', '49ers', 'San Francisco 49ers', 'SFO'],
//         ['STL', 'St. Louis', 'Rams', 'St. Louis Rams'],
//         ['TB', 'Tampa Bay', 'Buccaneers', 'Tampa Bay Buccaneers', 'TAM'],
//         ['TEN', 'Tennessee', 'Titans', 'Tennessee Titans'],
//         ['WAS', 'Washington', 'Redskins', 'Washington Redskins', 'WSH'],
//     ]
// }


/***/ }),

/***/ "./src/nflgame/Game.ts":
/*!*****************************!*\
  !*** ./src/nflgame/Game.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getPlayerStats(nflGame) {
    if (nflGame == null) {
        return [];
    }
    else {
        const home = nflGame.home.stats;
        const away = nflGame.away.stats;
        return flattenStats(home).concat(flattenStats(away));
    }
}
exports.getPlayerStats = getPlayerStats;
function flattenStats(stats) {
    // verbose, but clearer. Should refactor
    const playerStats = [];
    if (stats.passing) {
        Object.keys(stats.passing).forEach(playerId => {
            const stat = {
                playerId: playerId,
                category: "passing",
                name: stats.passing[playerId].name,
                passing_att: stats.passing[playerId].att,
                passing_cmp: stats.passing[playerId].cmp,
                passing_yds: stats.passing[playerId].yds,
                passing_tds: stats.passing[playerId].tds,
                passing_ints: stats.passing[playerId].ints,
                passing_twopta: stats.passing[playerId].twopta,
                passing_twoptm: stats.passing[playerId].twoptm
            };
            playerStats.push(stat);
        });
    }
    if (stats.rushing) {
        Object.keys(stats.rushing).forEach(playerId => {
            const stat = {
                playerId: playerId,
                category: "rushing",
                name: stats.rushing[playerId].name,
                rushing_att: stats.rushing[playerId].att,
                rushing_yds: stats.rushing[playerId].yds,
                rushing_tds: stats.rushing[playerId].tds,
                rushing_lng: stats.rushing[playerId].lng,
                rushing_lngtd: stats.rushing[playerId].lngtd,
                rushing_twopta: stats.rushing[playerId].twopta,
                rushing_twoptm: stats.rushing[playerId].twoptm
            };
            playerStats.push(stat);
        });
    }
    if (stats.receiving) {
        Object.keys(stats.receiving).forEach(playerId => {
            const stat = {
                playerId: playerId,
                category: "receiving",
                name: stats.receiving[playerId].name,
                receiving_rec: stats.receiving[playerId].rec,
                receiving_yds: stats.receiving[playerId].yds,
                receiving_tds: stats.receiving[playerId].tds,
                receiving_lng: stats.receiving[playerId].lng,
                receiving_lngtd: stats.receiving[playerId].lngtd,
                receiving_twopta: stats.receiving[playerId].twopta,
                receiving_twoptm: stats.receiving[playerId].twoptm
            };
            playerStats.push(stat);
        });
    }
    if (stats.fumbles) {
        Object.keys(stats.fumbles).forEach(playerId => {
            const stat = {
                playerId: playerId,
                category: "fumbles",
                name: stats.fumbles[playerId].name,
                fumbles_forced: stats.fumbles[playerId].forced,
                fumbles_lost: stats.fumbles[playerId].lost,
                fumbles_notforced: stats.fumbles[playerId].notforced,
                fumbles_oob: stats.fumbles[playerId].oob,
                fumbles_rec: stats.fumbles[playerId].rec,
                fumbles_rec_yds: stats.fumbles[playerId].rec_yds,
                fumbles_tot: stats.fumbles[playerId].tot,
                fumbles_rec_tds: stats.fumbles[playerId].rec_tds
            };
            playerStats.push(stat);
        });
    }
    if (stats.kicking) {
        Object.keys(stats.kicking).forEach(playerId => {
            const stat = {
                playerId: playerId,
                category: "kicking",
                name: stats.kicking[playerId].name,
                kicking_fgm: stats.kicking[playerId].fgm,
                kicking_fga: stats.kicking[playerId].fga,
                kicking_fgyds: stats.kicking[playerId].fgyds,
                kicking_totpfg: stats.kicking[playerId].totpfg,
                kicking_xpmade: stats.kicking[playerId].xpmade,
                kicking_xpa: stats.kicking[playerId].xpa,
                kicking_xpb: stats.kicking[playerId].xpb,
                kicking_xptot: stats.kicking[playerId].xptot
            };
            playerStats.push(stat);
        });
    }
    if (stats.punting) {
        Object.keys(stats.punting).forEach(playerId => {
            const stat = {
                playerId: playerId,
                category: "punting",
                name: stats.punting[playerId].name,
                punting_pts: stats.punting[playerId].pts,
                punting_yds: stats.punting[playerId].yds,
                punting_avg: stats.punting[playerId].avg,
                punting_i20: stats.punting[playerId].i20,
                punting_lng: stats.punting[playerId].lng
            };
            playerStats.push(stat);
        });
    }
    if (stats.kickret) {
        Object.keys(stats.kickret).forEach(playerId => {
            const stat = {
                playerId: playerId,
                category: "kickret",
                name: stats.kickret[playerId].name,
                kickret_ret: stats.kickret[playerId].ret,
                kickret_avg: stats.kickret[playerId].avg,
                kickret_tds: stats.kickret[playerId].tds,
                kickret_lng: stats.kickret[playerId].lng,
                kickret_lngtd: stats.kickret[playerId].lngtd
            };
            playerStats.push(stat);
        });
    }
    if (stats.puntret) {
        Object.keys(stats.puntret).forEach(playerId => {
            const stat = {
                playerId: playerId,
                category: "puntret",
                name: stats.puntret[playerId].name,
                puntret_ret: stats.puntret[playerId].ret,
                puntret_avg: stats.puntret[playerId].avg,
                puntret_tds: stats.puntret[playerId].tds,
                puntret_lng: stats.puntret[playerId].lng,
                puntret_lngtd: stats.puntret[playerId].lngtd
            };
            playerStats.push(stat);
        });
    }
    if (stats.defense) {
        Object.keys(stats.defense).forEach(playerId => {
            const stat = {
                playerId: playerId,
                category: "defense",
                name: stats.defense[playerId].name,
                defense_tkl: stats.defense[playerId].tkl,
                defense_ast: stats.defense[playerId].ast,
                defense_sk: stats.defense[playerId].sk,
                defense_int: stats.defense[playerId].int,
                defense_ffum: stats.defense[playerId].ffum
            };
            playerStats.push(stat);
        });
    }
    return playerStats;
}
// export function parseGame(g: nflApiGame): GameDetails {
//   const game: GameDetails = {
//     weather: g.weather ? g.weather : "",
//     media: g.media ? g.media : "",
//     yl: g.yl,
//     qtr: g.qtr,
//     note: g.note ? g.note : "",
//     down: g.down,
//     togo: g.togo,
//     redzone: g.redzone,
//     clock: g.clock,
//     posteam: g.posteam,
//     stadium: g.stadium ? g.stadium : "",
//     homeShort: g.home.abbr,
//     awayShort: g.away.abbr,
//     homeScore: g.home.score,
//     awayScore: g.away.score
//   };
//   return game;
// }
function gamesGen(year, week, home, away, kind = "REG", started = false) {
    /*
      games returns a generator of all games matching the given criteria. Each
      game can then be queried for player statistics and information about
      the game itself (score, winner, scoring plays, etc.).
  
      As a special case, if the home and away teams are set to the same team,
      then all games where that team played are returned.
  
      The kind parameter specifies whether to fetch preseason, regular season
      or postseason games. Valid values are PRE, REG and POST.
  
      The week parameter is relative to the value of the kind parameter, and
      may be set to a list of week numbers.
  
      In the regular season, the week parameter corresponds to the normal
      week numbers 1 through 17. Similarly in the preseason, valid week numbers
      are 1 through 4. In the post season, the week number corresponds to the
      numerical round of the playoffs. So the wild card round is week 1,
      the divisional round is week 2, the conference round is week 3
      and the Super Bowl is week 4.
  
      The year parameter specifies the season, and not necessarily the actual
      year that a game was played in. For example, a Super Bowl taking place
      in the year 2011 actually belongs to the 2010 season. Also, the year
      parameter may be set to a list of seasons just like the week parameter.
      Note that if a game's JSON data is not cached to disk, it is retrieved
      from the NFL web site. A game's JSON data is *only* cached to disk once
      the game is over, so be careful with the number of times you call this
      while a game is going on. (i.e., don't piss off NFL.com.)
  
      If started is True, then only games that have already started (or are
      about to start in less than 5 minutes) will be returned. Note that the
      started parameter requires pytz to be installed. This is useful when
      you only want to collect stats from games that have JSON data available
      (as opposed to waiting for a 404 error from NFL.com).
      */
}
exports.gamesGen = gamesGen;


/***/ }),

/***/ "./src/nflgame/jsonCache.ts":
/*!**********************************!*\
  !*** ./src/nflgame/jsonCache.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(__webpack_require__(/*! fs-extra */ "fs-extra"));
class jsonCache {
    constructor(filepath) {
        this.folderpath = filepath;
    }
    getAbsPath() {
    }
    // get list of games
    getSchedule() {
        const schedulePath = `${this.folderpath}/s_master.json`;
        const exists = fs_extra_1.default.pathExistsSync(schedulePath);
        if (exists) {
            try {
                const schedule = fs_extra_1.default.readJSONSync(schedulePath);
                return schedule;
            }
            catch (err) {
                // json read unsuccessful
                console.error(err);
                return [];
            }
        }
        else {
            // path or file does not exist at all
            console.log('path does not exist');
            return [];
        }
    }
    saveSchedule(schedule) {
        return __awaiter(this, void 0, void 0, function* () {
            const schedulePath = `${this.folderpath}/s_master.json`;
            try {
                yield fs_extra_1.default.writeJSON(schedulePath, schedule);
                return true;
            }
            catch (err) {
                // console.error(err)
                throw err;
            }
        });
    }
    // get list of players
    getPlayerList() {
        const playerPath = `${this.folderpath}/p_master.json`;
        const exists = fs_extra_1.default.pathExistsSync(playerPath);
        if (exists) {
            const players = fs_extra_1.default.readJSONSync(playerPath);
            return players;
        }
        else {
            return {};
        }
    }
    // save list of players
    savePlayerList(players) {
        return __awaiter(this, void 0, void 0, function* () {
            const playerPath = `${this.folderpath}/p_master.json`;
            try {
                yield fs_extra_1.default.writeJSON(playerPath, players);
                return true;
            }
            catch (err) {
                throw err;
            }
        });
    }
    // retrieve a game from the cache
    getGame(gameid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const game = yield fs_extra_1.default.readJSON(`${this.folderpath}/${gameid}.json`);
                return game;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // save a game to the cache
    saveGame(gameid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs_extra_1.default.outputJSON(`${this.folderpath}/${gameid}.json`, data);
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
}
exports.default = jsonCache;


/***/ }),

/***/ "./src/nflgame/nflApi.ts":
/*!*******************************!*\
  !*** ./src/nflgame/nflApi.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(__webpack_require__(/*! axios */ "axios"));
const cheerio_1 = __importDefault(__webpack_require__(/*! cheerio */ "cheerio"));
const lodash_1 = __importDefault(__webpack_require__(/*! lodash */ "lodash"));
const nflCurrentSchedule = "http://www.nfl.com/liveupdate/scorestrip/ss.xml";
const nflCurrentSchedulePostSeason = "http://www.nfl.com/liveupdate/scorestrip/postseason/ss.xml";
const nflRosterUrl = "http://www.nfl.com/teams/roster?team=";
const nflProfileUrl = "http://www.nfl.com/players/profile?id=";
class NFLApi {
    static yearPhaseWeek(week) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentWeek;
            if (!week) {
                currentWeek = yield NFLApi.currentYearPhaseWeek();
            }
            else {
                currentWeek = week;
            }
            const nflYear = [
                ["PRE", 0],
                ["PRE", 1],
                ["PRE", 2],
                ["PRE", 3],
                ["PRE", 4],
                ["PRE", 5],
                ["REG", 1],
                ["REG", 2],
                ["REG", 3],
                ["REG", 4],
                ["REG", 5],
                ["REG", 6],
                ["REG", 7],
                ["REG", 8],
                ["REG", 9],
                ["REG", 10],
                ["REG", 11],
                ["REG", 12],
                ["REG", 13],
                ["REG", 14],
                ["REG", 15],
                ["REG", 16],
                ["REG", 17],
                ["REG", 18],
                ["POST", 1],
                ["POST", 2],
                ["POST", 3],
                ["POST", 4],
                ["POST", 5]
            ];
            const scheduleWeeks = [];
            // There should be a better way to write this
            // 1. generate all the weeks up to the current year
            const mapWeeks = lodash_1.default.map(lodash_1.default.range(2009, currentWeek.year + 1), 
            // 2. generate based on the list of season games
            y => nflYear.map(w => {
                return {
                    year: y,
                    week: +w[1],
                    stype: w[0].toString()
                };
            }));
            // 3. flatten the array
            const allWeeks = lodash_1.default.flatten(mapWeeks);
            // 4. run through the generated weeks up to the current week
            for (let i = 0; i < allWeeks.length; i++) {
                scheduleWeeks.push(allWeeks[i]);
                // stop once it is a current week
                if (allWeeks[i].year == currentWeek.year &&
                    allWeeks[i].week == currentWeek.week &&
                    allWeeks[i].stype == currentWeek.stype) {
                    i = allWeeks.length;
                }
            }
            return lodash_1.default.reverse(scheduleWeeks);
        });
    }
    static getScheduleUrl(year, stype, week) {
        // Returns the NFL.com XML schedule URL.
        const baseUrl = "https://www.nfl.com/ajax/scorestrip?";
        if (stype == "POST") {
            week += 17;
            if (week == 21) {
                week += 1;
            }
        }
        return `${baseUrl}season=${year}&seasonType=${stype}&week=${week}`;
    }
    static getWeekSchedule(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = NFLApi.getScheduleUrl(params.year, params.stype, params.week);
            try {
                const response = yield axios_1.default.get(url);
                const xml = response.data;
                const $ = cheerio_1.default.load(xml);
                const games = [];
                // game schedule is returned from the score strip as xml
                // each <g> represents a game.
                $("g").each((i, e) => {
                    const gid = $(e).attr("eid");
                    games[i] = {
                        gameid: gid,
                        wday: $(e).attr("d"),
                        // gsis: +$(e).attr("gsis"),
                        year: params.year,
                        month: +gid.slice(4, 6),
                        day: +gid.slice(6, 8),
                        time: $(e).attr("t"),
                        quarter: $(e).attr("q"),
                        gameType: params.stype,
                        week: params.week,
                        homeShort: $(e).attr("h"),
                        homeName: $(e).attr("hnn"),
                        homeScore: +$(e).attr("hs"),
                        awayShort: $(e).attr("v"),
                        awayName: $(e).attr("vnn"),
                        awayScore: +$(e).attr("vs")
                    };
                });
                // console.log(games)
                return games;
            }
            catch (err) {
                throw err;
            }
        });
    }
    static currentYearPhaseWeek() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentSchedule = yield axios_1.default.get(nflCurrentSchedule);
            const $ = cheerio_1.default.load(currentSchedule.data);
            const week = {
                week: +$("gms").attr("w"),
                year: +$("gms").attr("y"),
                stype: "REG"
            };
            const p = $("gms").attr("t");
            if (p == "P") {
                week.stype = "PRE";
            }
            else if (p == "POST" || p == "PRO") {
                week.stype = "POST";
                week.week -= 17;
            }
            else {
                // phase is REG
            }
            return week;
        });
    }
    // gets the game detail data from NFL's gamecenter endpoint
    static getGame(gameid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `https://www.nfl.com/liveupdate/game-center/${gameid}/${gameid}_gtd.json`;
                const response = yield axios_1.default.get(url);
                return response.data[gameid];
            }
            catch (err) {
                throw err;
            }
        });
    }
    static rosterParser(rawRoster) {
        return __awaiter(this, void 0, void 0, function* () {
            const $ = cheerio_1.default.load(rawRoster);
            const evens = $("tr[class=even]");
            const odds = $("tr[class=odd]");
            const players = [];
            //@ts-ignore
            const addPlayer = (index, element) => {
                const meta = $(element).children();
                const player = {};
                meta.each((i, e) => {
                    switch (i) {
                        case 0:
                            player.number = $(e).text();
                            break;
                        case 1:
                            const name = $(e).children().first().text().trim();
                            if (name.includes(",")) {
                                player.lastName = name.split(",")[0];
                                player.firstName = name.split(",")[1];
                            }
                            else {
                                player.lastName = name;
                                player.firstName = "";
                            }
                            player.profileUrl = $(e).children().first().attr("href");
                            player.playerid = profileIdFromUrl(player.profileUrl);
                            break;
                        case 2:
                            player.position = $(e).text();
                            break;
                        case 3:
                            player.status = $(e).text();
                            break;
                        case 4:
                            player.height = $(e).text();
                            break;
                        case 5:
                            player.weight = $(e).text();
                            break;
                        case 6:
                            player.birthdate = $(e).text();
                            break;
                        case 7:
                            player.yexp = $(e).text();
                            break;
                        case 8:
                            player.college = $(e).text();
                        default:
                            break;
                    }
                });
                players.push(player);
            };
            evens.each(addPlayer);
            odds.each(addPlayer);
            return players;
            // return _.concat(evens, odds);
        });
    }
    static getRoster(team) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = nflRosterUrl + team;
                const response = yield axios_1.default.get(url);
                return response.data;
            }
            catch (err) {
                throw err;
            }
        });
    }
    static getPlayerProfile(gsisId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`https://www.nfl.com/players/profile?id=${gsisId}`);
            return response.data;
        });
    }
}
exports.default = NFLApi;
function profileIdFromUrl(url) {
    return url.match(/([0-9]+)/)[0];
}


/***/ }),

/***/ "./src/nflgame/nflPlayer.ts":
/*!**********************************!*\
  !*** ./src/nflgame/nflPlayer.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(__webpack_require__(/*! cheerio */ "cheerio"));
function parseProfile(html) {
    const $ = cheerio_1.default.load(html);
    // number and postiion only available to active players
    const numberStrip = $('span.player-number').text();
    // const playerInfo = $('div.player-info').children()
    const nameStrip = $('#playerName').attr('content');
    const playerId = $('#playerId').attr('content');
    let team = $('#playerTeam').attr('content');
    const url = $('link[rel=canonical]').attr('href');
    // const physicalRow = playerInfo.filter((i, e) => i == 2);
    // regex seems to be the easiest way to get at these specific pieces of data.
    const gsisId = html.match(/(?:GSIS ID: )\W*(\d+\W+\d+)/)[1];
    const heightStrip = html.match(/(?:<strong>)(?:Height)(?:<\/strong>)\W\s(\d+\W\d+)/)[1];
    const weightStrip = html.match(/(?:<strong>)(?:Weight)(?:<\/strong>)\W\s(\d+)/)[1];
    const ageStrip = html.match(/(?:<strong>)(?:Age)(?:<\/strong>)\W\s(\d+)/)[1];
    const birthStrip = html.match(/(?:<strong>)(?:Born)(?:<\/strong>)\W+\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+(\b[a-zA-Z\s]+,[ ]?[A-Z]{2}\b)/);
    const collegeStrip = html.match(/(?:<strong>)(?:College)(?:<\/strong>)\W\s+([\w-\s]+)/);
    // console.log(numberStrip);
    let number = 0;
    let position = '';
    // TODO: a lot of redundancy here.
    const firstName = nameStrip.split(' ')[0].trim();
    const lastName = nameStrip.split(' ')[1].trim();
    const fullName = `${firstName} ${lastName}`;
    let birthDate = '';
    let birthCity = '';
    if (birthStrip != null) {
        birthDate = birthStrip[1];
        birthCity = birthStrip[2];
    }
    const weight = +weightStrip;
    const college = collegeStrip[1];
    const age = +ageStrip;
    const height = feetInchesToInches(heightStrip);
    if (numberStrip == null) {
        team = '';
    }
    else {
        const numberPresent = numberStrip.match(/(\d+)/);
        const positionPresent = numberStrip.match(/([A-Z]+)/);
        if (numberPresent != null && positionPresent != null) {
            number = +numberStrip.match(/(\d+)/)[0];
            position = numberStrip.match(/([A-Z]+)/)[0];
        }
    }
    return {
        fullName,
        playerId,
        team,
        firstName,
        gsisId,
        lastName,
        birthCity,
        birthDate,
        college,
        age,
        profileUrl: url,
        profileId: profileIdFromUrl(url),
        number,
        position,
        weight,
        height
    };
}
exports.parseProfile = parseProfile;
function profileIdFromUrl(url) {
    return url.match(/([0-9]+)/)[0];
}
function feetInchesToInches(height) {
    const [feet, inches] = height.split('-');
    return 12 * +feet + +inches;
}


/***/ }),

/***/ "./src/nflgame/nflgame.ts":
/*!********************************!*\
  !*** ./src/nflgame/nflgame.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonCache_1 = __importDefault(__webpack_require__(/*! ./jsonCache */ "./src/nflgame/jsonCache.ts"));
const nflApi_1 = __importDefault(__webpack_require__(/*! ./nflApi */ "./src/nflgame/nflApi.ts"));
// import { searchScheduleArgs, Schedule } from "../schemas/Schedule";
const lodash_1 = __importDefault(__webpack_require__(/*! lodash */ "lodash"));
const nflPlayer_1 = __webpack_require__(/*! ./nflPlayer */ "./src/nflgame/nflPlayer.ts");
const Game_1 = __webpack_require__(/*! ./Game */ "./src/nflgame/Game.ts");
function transposeArgs(args) {
    const params = {
        homeShort: args.home,
        awayShort: args.away,
        gameType: args.seasonType,
        week: args.week,
        year: args.year
    };
    return lodash_1.default.omitBy(params, lodash_1.default.isUndefined);
}
class nflGame {
    constructor(filePath) {
        this.mountGameDetails = (scheduleGame) => __awaiter(this, void 0, void 0, function* () {
            const gameDetails = yield this.getGame(scheduleGame.gameid);
            const game = {
                gameid: scheduleGame.gameid,
                wday: scheduleGame.wday,
                month: scheduleGame.month,
                quarter: scheduleGame.quarter,
                day: scheduleGame.day,
                gameType: scheduleGame.gameType,
                homeShort: scheduleGame.homeShort,
                homeName: scheduleGame.homeName,
                homeScore: gameDetails.home.score.T,
                awayShort: scheduleGame.awayShort,
                awayName: scheduleGame.awayName,
                awayScore: gameDetails.away.score.T,
                redzone: gameDetails.redzone,
                yl: gameDetails.yl,
                media: gameDetails.media ? gameDetails.media : "",
                clock: gameDetails.clock,
                weather: gameDetails.weather ? gameDetails.weather : "",
                homeScore_q1: gameDetails.home.score["1"],
                homeScore_q2: gameDetails.home.score["2"],
                homeScore_q3: gameDetails.home.score["3"],
                homeScore_q4: gameDetails.home.score["4"],
                awayScore_q1: gameDetails.away.score["1"],
                awayScore_q2: gameDetails.away.score["2"],
                awayScore_q3: gameDetails.away.score["3"],
                awayScore_q4: gameDetails.away.score["4"]
            };
            return game;
        });
        nflGame.filePath = filePath;
        this.cache = new jsonCache_1.default(filePath);
        //@ts-ignore
        this.schedule = this.cache.getSchedule();
        this.players = this.cache.getPlayerList();
    }
    static getInstance(filePath) {
        if (!nflGame.instance && filePath) {
            nflGame.instance = new nflGame(filePath);
            return nflGame.instance;
        }
        else if (filePath != nflGame.filePath && filePath) {
            nflGame.instance = new nflGame(filePath);
            return nflGame.instance;
        }
        else if (!nflGame.instance && !filePath) {
            throw new Error("filepath is not set, cannot retrieve cache");
        }
        else {
            return nflGame.instance;
        }
    }
    regenerateSchedule() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gamesTillNow = yield nflApi_1.default.yearPhaseWeek();
                const games = yield Promise.all(gamesTillNow.map(nflApi_1.default.getWeekSchedule));
                //@ts-ignore
                const save = yield this.cache.saveSchedule(lodash_1.default.flatten(games));
                return save;
            }
            catch (err) {
                throw err;
            }
        });
    }
    searchSchedule(args) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(transposeArgs(args));
            let games = [];
            try {
                if (this.schedule.length < 1) {
                    yield this.regenerateSchedule();
                    // TODO: figure out why this is producing a type error
                    //@ts-ignore
                    games = lodash_1.default.filter(this.schedule, transposeArgs(args));
                }
                else {
                    //@ts-ignore
                    games = lodash_1.default.filter(this.schedule, transposeArgs(args));
                }
                const mountedGames = yield games.map(this.mountGameDetails);
                return mountedGames;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getSingleGame(gameid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const game = lodash_1.default.find(this.schedule, { gameid: gameid });
                if (game) {
                    return yield this.mountGameDetails(game);
                }
                else {
                    return null;
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    getGame(gameid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nflGame = yield this.getGamecenterGame(gameid);
                return nflGame;
            }
            catch (error) {
                // console.error(error);
                throw error;
            }
        });
    }
    getGamecenterGame(gameid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!gameid) {
                throw new Error("no gameid passed");
            }
            try {
                const cacheGame = yield this.cache.getGame(gameid);
                // if (!cacheGame) {
                // if cached game is not found,
                // we fetch the game from NFL.com
                // } else {
                // if the game is found in cache that is returned instead.
                console.log("game found in cache");
                cacheGame.gameid = gameid;
                return cacheGame;
                // }
            }
            catch (err) {
                console.log("game is not found in cache, pulling from nfl.com");
                try {
                    const gameResponse = yield this.fetchGame(gameid);
                    // and save it to cache
                    yield this.cache.saveGame(gameid, gameResponse);
                    // before returning it to the user
                    // @ts-ignore
                    gameResponse.gameid = gameid;
                    return gameResponse;
                }
                catch (error) {
                    throw error;
                }
            }
        });
    }
    getAggGameStats(gameid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const game = yield this.getGamecenterGame(gameid);
                return Game_1.getPlayerStats(game);
            }
            catch (error) {
                console.error(error);
                return [];
            }
        });
    }
    fetchGame(gameid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const game = yield nflApi_1.default.getGame(gameid);
                return game;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    fetchPlayer(gsisId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const html = yield nflApi_1.default.getPlayerProfile(gsisId);
                const player = nflPlayer_1.parseProfile(html);
                this.players[gsisId] = player;
                yield this.cache.savePlayerList(this.players);
                return player;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getPlayer(gsisId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const match = lodash_1.default.filter(this.players, { gsisId: gsisId });
                if (match.length < 1) {
                    console.log("player not found... fetching");
                    const player = yield this.fetchPlayer(gsisId);
                    console.log(`added ${player.fullName}`);
                    return player;
                }
                else {
                    console.log("player found");
                    return match[0];
                }
            }
            catch (err) {
                console.error(err);
                return {};
            }
        });
    }
}
exports.default = nflGame;


/***/ }),

/***/ "./src/resolvers/AggGameStatResolver.ts":
/*!**********************************************!*\
  !*** ./src/resolvers/AggGameStatResolver.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(/*! reflect-metadata */ "reflect-metadata");
const type_graphql_1 = __webpack_require__(/*! type-graphql */ "type-graphql");
const AggGameStat_1 = __webpack_require__(/*! ../schemas/AggGameStat */ "./src/schemas/AggGameStat.ts");
const nflgame_1 = __importDefault(__webpack_require__(/*! ../nflgame/nflgame */ "./src/nflgame/nflgame.ts"));
let AggGameStatResolver = class AggGameStatResolver {
    getGameStatsByGameId(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.id) {
                throw new Error('no id passed');
            }
            try {
                let stats = yield nflgame_1.default.getInstance().getAggGameStats(params.id);
                // if (name || category) {
                //     const filter = {}
                //     if(name){
                //         //@ts-ignore
                //         filter.name = name
                //     }
                //     if(category){
                //         //@ts-ignore
                //         filter.category = category
                //     }
                //     stats = _.filter(stats, filter);
                // }
                return stats;
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    player(stat) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield nflgame_1.default.getInstance().getPlayer(stat.playerId);
        });
    }
};
__decorate([
    type_graphql_1.Query(returns => [AggGameStat_1.AggGameStat]),
    __param(0, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AggGameStat_1.AggGameStatArgs]),
    __metadata("design:returntype", Promise)
], AggGameStatResolver.prototype, "getGameStatsByGameId", null);
__decorate([
    type_graphql_1.FieldResolver(),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AggGameStat_1.AggGameStat]),
    __metadata("design:returntype", Promise)
], AggGameStatResolver.prototype, "player", null);
AggGameStatResolver = __decorate([
    type_graphql_1.Resolver(of => AggGameStat_1.AggGameStat)
], AggGameStatResolver);
exports.default = AggGameStatResolver;


/***/ }),

/***/ "./src/resolvers/GameResolver.ts":
/*!***************************************!*\
  !*** ./src/resolvers/GameResolver.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(/*! reflect-metadata */ "reflect-metadata");
const type_graphql_1 = __webpack_require__(/*! type-graphql */ "type-graphql");
const Game_1 = __webpack_require__(/*! ../schemas/Game */ "./src/schemas/Game.ts");
const nflgame_1 = __importDefault(__webpack_require__(/*! ../nflgame/nflgame */ "./src/nflgame/nflgame.ts"));
let GameResolver = class GameResolver {
    games(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schedule = yield nflgame_1.default.getInstance().searchSchedule(input);
                return schedule;
            }
            catch (error) {
                throw error;
            }
        });
    }
    game(gameid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const game = yield nflgame_1.default.getInstance().getSingleGame(gameid);
                return game;
            }
            catch (err) {
                throw err;
            }
        });
    }
    aggregatedGameStats(game) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gameDetails = yield nflgame_1.default
                    .getInstance()
                    .getAggGameStats(game.gameid);
                return gameDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
};
__decorate([
    type_graphql_1.Query(returns => [Game_1.Game], { nullable: true }),
    __param(0, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Game_1.gameSearchArgs]),
    __metadata("design:returntype", Promise)
], GameResolver.prototype, "games", null);
__decorate([
    type_graphql_1.Query(returns => Game_1.Game, { nullable: true }),
    __param(0, type_graphql_1.Arg("gameid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GameResolver.prototype, "game", null);
__decorate([
    type_graphql_1.FieldResolver(),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Game_1.Game]),
    __metadata("design:returntype", Promise)
], GameResolver.prototype, "aggregatedGameStats", null);
GameResolver = __decorate([
    type_graphql_1.Resolver(of => Game_1.Game)
], GameResolver);
exports.default = GameResolver;


/***/ }),

/***/ "./src/resolvers/PlayerResolver.ts":
/*!*****************************************!*\
  !*** ./src/resolvers/PlayerResolver.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = __webpack_require__(/*! type-graphql */ "type-graphql");
const Player_1 = __importDefault(__webpack_require__(/*! ../schemas/Player */ "./src/schemas/Player.ts"));
const nflgame_1 = __importDefault(__webpack_require__(/*! ../nflgame/nflgame */ "./src/nflgame/nflgame.ts"));
// import { getPlayerById } from "../nflgame/nflPlayer";
// @Resolver(of => Game)
// export default class {
//     @Query(returns => Game, { nullable: true })
//     async gameByid(@Arg("eid") eid: number): Promise<any> { }
// }
let default_1 = class default_1 {
    Player(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = yield nflgame_1.default.getInstance().getPlayer(id);
            return p;
        });
    }
};
__decorate([
    type_graphql_1.Query(returns => Player_1.default),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], default_1.prototype, "Player", null);
default_1 = __decorate([
    type_graphql_1.Resolver(of => Player_1.default)
], default_1);
exports.default = default_1;


/***/ }),

/***/ "./src/schemas/AggGameStat.ts":
/*!************************************!*\
  !*** ./src/schemas/AggGameStat.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = __webpack_require__(/*! type-graphql */ "type-graphql");
const Player_1 = __importDefault(__webpack_require__(/*! ./Player */ "./src/schemas/Player.ts"));
let AggGameStatArgs = class AggGameStatArgs {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], AggGameStatArgs.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], AggGameStatArgs.prototype, "playerName", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], AggGameStatArgs.prototype, "category", void 0);
AggGameStatArgs = __decorate([
    type_graphql_1.ArgsType()
], AggGameStatArgs);
exports.AggGameStatArgs = AggGameStatArgs;
let AggGameStat = class AggGameStat {
};
__decorate([
    type_graphql_1.Field(type => Player_1.default),
    __metadata("design:type", Player_1.default)
], AggGameStat.prototype, "player", void 0);
__decorate([
    type_graphql_1.Field(type => type_graphql_1.ID),
    __metadata("design:type", String)
], AggGameStat.prototype, "playerId", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], AggGameStat.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], AggGameStat.prototype, "category", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "passing_att", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "passing_cmp", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "passing_yds", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "passing_ints", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "passing_twopta", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "passing_twoptm", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "rushing_att", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "rushing_yds", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "rushing_tds", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "rushing_lng", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "rushing_lngtd", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "rushing_twopta", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "rushing_twoptm", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "receiving_rec", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "receiving_yds", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "receiving_tds", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "receiving_lng", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "receiving_lngtd", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "receiving_twopta", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "receiving_twoptm", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "fumbles_forced", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "fumbles_lost", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "fumbles_notforced", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "fumbles_oob", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "fumbles_rec_yds", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "fumbles_tot", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "fumbles_rec_tds", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "kicking_fgm", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "kicking_fga", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "kicking_fgyds", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "kicking_totpfg", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "kicking_xpmade", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "kicking_xpa", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "kicking_xpb", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "kicking_xptot", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "punting_pts", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "punting_yds", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "punting_avg", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "punting_i20", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "punting_lng", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "kickret_ret", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "kickret_avg", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "kickret_tds", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "kickret_lng", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "kickret_lngtd", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "puntret_ret", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "puntret_avg", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "puntret_tds", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "puntret_lng", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "puntret_lngtd", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "defense_tkl", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "defense_ast", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "defense_int", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], AggGameStat.prototype, "defense_ffum", void 0);
AggGameStat = __decorate([
    type_graphql_1.ObjectType()
], AggGameStat);
exports.AggGameStat = AggGameStat;


/***/ }),

/***/ "./src/schemas/Game.ts":
/*!*****************************!*\
  !*** ./src/schemas/Game.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(/*! reflect-metadata */ "reflect-metadata");
const type_graphql_1 = __webpack_require__(/*! type-graphql */ "type-graphql");
const AggGameStat_1 = __webpack_require__(/*! ./AggGameStat */ "./src/schemas/AggGameStat.ts");
let gameSearchArgs = class gameSearchArgs {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], gameSearchArgs.prototype, "year", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], gameSearchArgs.prototype, "week", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], gameSearchArgs.prototype, "home", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], gameSearchArgs.prototype, "away", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], gameSearchArgs.prototype, "seasonType", void 0);
gameSearchArgs = __decorate([
    type_graphql_1.ArgsType()
], gameSearchArgs);
exports.gameSearchArgs = gameSearchArgs;
let Game = class Game {
};
__decorate([
    type_graphql_1.Field(type => type_graphql_1.ID),
    __metadata("design:type", String)
], Game.prototype, "gameid", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "wday", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], Game.prototype, "month", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Game.prototype, "quarter", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Game.prototype, "day", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Game.prototype, "gameType", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Game.prototype, "homeShort", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Game.prototype, "homeName", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Game.prototype, "homeScore", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Game.prototype, "awayShort", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Game.prototype, "awayName", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Game.prototype, "awayScore", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], Game.prototype, "redzone", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "weather", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "media", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Game.prototype, "clock", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Game.prototype, "yl", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Game.prototype, "homeScore_q1", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Game.prototype, "homeScore_q2", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Game.prototype, "homeScore_q3", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Game.prototype, "homeScore_q4", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Game.prototype, "awayScore_q1", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Game.prototype, "awayScore_q2", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Game.prototype, "awayScore_q3", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Game.prototype, "awayScore_q4", void 0);
__decorate([
    type_graphql_1.Field(type => [AggGameStat_1.AggGameStat]),
    __metadata("design:type", Array)
], Game.prototype, "aggregatedGameStats", void 0);
Game = __decorate([
    type_graphql_1.ObjectType()
], Game);
exports.Game = Game;


/***/ }),

/***/ "./src/schemas/Player.ts":
/*!*******************************!*\
  !*** ./src/schemas/Player.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = __webpack_require__(/*! type-graphql */ "type-graphql");
let Player = class Player {
};
__decorate([
    type_graphql_1.Field(type => type_graphql_1.ID),
    __metadata("design:type", String)
], Player.prototype, "playerId", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Player.prototype, "firstName", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Player.prototype, "lastName", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Player.prototype, "fullName", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], Player.prototype, "age", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Player.prototype, "college", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], Player.prototype, "height", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], Player.prototype, "number", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Player.prototype, "position", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Player.prototype, "gsisId", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Player.prototype, "profileId", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Player.prototype, "profileUrl", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Player.prototype, "birthDate", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Player.prototype, "birthCity", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Player.prototype, "status", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Player.prototype, "team", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], Player.prototype, "weight", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], Player.prototype, "yearsPro", void 0);
Player = __decorate([
    type_graphql_1.ObjectType()
], Player);
exports.default = Player;


/***/ }),

/***/ 0:
/*!**************************************************!*\
  !*** multi webpack/hot/poll?1000 ./src/index.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! webpack/hot/poll?1000 */"./node_modules/webpack/hot/poll.js?1000");
module.exports = __webpack_require__(/*! C:\working\nflg\src\index.ts */"./src/index.ts");


/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),

/***/ "cheerio":
/*!**************************!*\
  !*** external "cheerio" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cheerio");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "fs-extra":
/*!***************************!*\
  !*** external "fs-extra" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs-extra");

/***/ }),

/***/ "graphql-yoga":
/*!*******************************!*\
  !*** external "graphql-yoga" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql-yoga");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "reflect-metadata":
/*!***********************************!*\
  !*** external "reflect-metadata" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("reflect-metadata");

/***/ }),

/***/ "type-graphql":
/*!*******************************!*\
  !*** external "type-graphql" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("type-graphql");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2hvdC9sb2cuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvcG9sbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL25mbGdhbWUvR2FtZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbmZsZ2FtZS9qc29uQ2FjaGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL25mbGdhbWUvbmZsQXBpLnRzIiwid2VicGFjazovLy8uL3NyYy9uZmxnYW1lL25mbFBsYXllci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbmZsZ2FtZS9uZmxnYW1lLnRzIiwid2VicGFjazovLy8uL3NyYy9yZXNvbHZlcnMvQWdnR2FtZVN0YXRSZXNvbHZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVzb2x2ZXJzL0dhbWVSZXNvbHZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVzb2x2ZXJzL1BsYXllclJlc29sdmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9zY2hlbWFzL0FnZ0dhbWVTdGF0LnRzIiwid2VicGFjazovLy8uL3NyYy9zY2hlbWFzL0dhbWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjaGVtYXMvUGxheWVyLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcImF4aW9zXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY2hlZXJpb1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImRvdGVudlwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZzLWV4dHJhXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZ3JhcGhxbC15b2dhXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibG9kYXNoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVmbGVjdC1tZXRhZGF0YVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInR5cGUtZ3JhcGhxbFwiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBNkI7QUFDN0IscUNBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUFxQixnQkFBZ0I7QUFDckM7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSw2QkFBcUIsZ0JBQWdCO0FBQ3JDO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQWtCLDhCQUE4QjtBQUNoRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0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VixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7Z0JBQ1YsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNWLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztnQkFDVixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7Z0JBQ1YsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNWLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztnQkFDVixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7Z0JBQ1YsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNWLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztnQkFDVixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7Z0JBQ1YsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNWLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztnQkFDVixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7Z0JBQ1YsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNWLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztnQkFDWCxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7Z0JBQ1gsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO2dCQUNYLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztnQkFDWCxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7Z0JBQ1gsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO2dCQUNYLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztnQkFDWCxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7Z0JBQ1gsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO2dCQUNYLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFDWCxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBQ1gsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2dCQUNYLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFDWCxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7YUFDWixDQUFDO1lBRUYsTUFBTSxhQUFhLEdBQW1CLEVBQUUs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Ozt3Q0FDUDtBQXREQSxNQUFNO0lBRDFCLHlCQUFVLEVBQUU7R0FDUSxNQUFNLENBdUQxQjtrQkF2RG9CLE1BQU07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNIM0Isa0M7Ozs7Ozs7Ozs7O0FDQUEsb0M7Ozs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7O0FDQUEscUM7Ozs7Ozs7Ozs7O0FDQUEseUM7Ozs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7O0FDQUEsNkM7Ozs7Ozs7Ozs7O0FDQUEseUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHR2YXIgY2h1bmsgPSByZXF1aXJlKFwiLi9cIiArIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIik7XG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rLmlkLCBjaHVuay5tb2R1bGVzKTtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KCkge1xuIFx0XHR0cnkge1xuIFx0XHRcdHZhciB1cGRhdGUgPSByZXF1aXJlKFwiLi9cIiArIFwiXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNvblwiKTtcbiBcdFx0fSBjYXRjaCAoZSkge1xuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiBcdFx0fVxuIFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVwZGF0ZSk7XG4gXHR9XG5cbiBcdC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuXG4gXHR2YXIgaG90QXBwbHlPblVwZGF0ZSA9IHRydWU7XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50SGFzaCA9IFwiMzliODc4Y2QzNTgxMmQ5NTkxMjFcIjtcbiBcdHZhciBob3RSZXF1ZXN0VGltZW91dCA9IDEwMDAwO1xuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XG4gXHR2YXIgaG90Q3VycmVudENoaWxkTW9kdWxlO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IFtdO1xuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHtcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdGlmICghbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gXHRcdFx0aWYgKG1lLmhvdC5hY3RpdmUpIHtcbiBcdFx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XG4gXHRcdFx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPT09IC0xKSB7XG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA9PT0gLTEpIHtcbiBcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0Y29uc29sZS53YXJuKFxuIFx0XHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArXG4gXHRcdFx0XHRcdFx0cmVxdWVzdCArXG4gXHRcdFx0XHRcdFx0XCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICtcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZFxuIFx0XHRcdFx0KTtcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XG4gXHRcdFx0fVxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xuIFx0XHR9O1xuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xuIFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XG4gXHRcdFx0XHR9LFxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fTtcbiBcdFx0fTtcbiBcdFx0Zm9yICh2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpICYmXG4gXHRcdFx0XHRuYW1lICE9PSBcImVcIiAmJlxuIFx0XHRcdFx0bmFtZSAhPT0gXCJ0XCJcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGZuLmUgPSBmdW5jdGlvbihjaHVua0lkKSB7XG4gXHRcdFx0aWYgKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKSBob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xuIFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcbiBcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xuIFx0XHRcdFx0dGhyb3cgZXJyO1xuIFx0XHRcdH0pO1xuXG4gXHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xuIFx0XHRcdFx0aWYgKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcbiBcdFx0XHRcdFx0aWYgKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH07XG4gXHRcdGZuLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRcdGlmIChtb2RlICYgMSkgdmFsdWUgPSBmbih2YWx1ZSk7XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18udCh2YWx1ZSwgbW9kZSAmIH4xKTtcbiBcdFx0fTtcbiBcdFx0cmV0dXJuIGZuO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkge1xuIFx0XHR2YXIgaG90ID0ge1xuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXG5cbiBcdFx0XHQvLyBNb2R1bGUgQVBJXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xuIFx0XHRcdFx0aWYgKGRlcCA9PT0gdW5kZWZpbmVkKSBob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpIGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcbiBcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcbiBcdFx0XHRcdGVsc2UgaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcbiBcdFx0XHR9LFxuIFx0XHRcdGRlY2xpbmU6IGZ1bmN0aW9uKGRlcCkge1xuIFx0XHRcdFx0aWYgKGRlcCA9PT0gdW5kZWZpbmVkKSBob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuIFx0XHRcdH0sXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0XHR9LFxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHR9LFxuXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0aWYgKCFsKSByZXR1cm4gaG90U3RhdHVzO1xuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbiBcdFx0XHR9LFxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG4gXHRcdFx0fSxcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0fSxcblxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxuIFx0XHR9O1xuIFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XG4gXHRcdHJldHVybiBob3Q7XG4gXHR9XG5cbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xuXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcbiBcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XG4gXHR9XG5cbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90RGVmZXJyZWQ7XG5cbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xuIFx0XHR2YXIgaXNOdW1iZXIgPSAraWQgKyBcIlwiID09PSBpZDtcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XG4gXHRcdGlmIChob3RTdGF0dXMgIT09IFwiaWRsZVwiKSB7XG4gXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XG4gXHRcdH1cbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcbiBcdFx0cmV0dXJuIGhvdERvd25sb2FkTWFuaWZlc3QoaG90UmVxdWVzdFRpbWVvdXQpLnRoZW4oZnVuY3Rpb24odXBkYXRlKSB7XG4gXHRcdFx0aWYgKCF1cGRhdGUpIHtcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XG4gXHRcdFx0XHRyZXR1cm4gbnVsbDtcbiBcdFx0XHR9XG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xuIFx0XHRcdGhvdFVwZGF0ZU5ld0hhc2ggPSB1cGRhdGUuaDtcblxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XG4gXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiBcdFx0XHRcdGhvdERlZmVycmVkID0ge1xuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxuIFx0XHRcdFx0XHRyZWplY3Q6IHJlamVjdFxuIFx0XHRcdFx0fTtcbiBcdFx0XHR9KTtcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcbiBcdFx0XHR2YXIgY2h1bmtJZCA9IFwibWFpblwiO1xuIFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1sb25lLWJsb2Nrc1xuIFx0XHRcdHtcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0XHR9XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0aG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJlxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJlxuIFx0XHRcdFx0aG90V2FpdGluZ0ZpbGVzID09PSAwXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdFx0fVxuIFx0XHRcdHJldHVybiBwcm9taXNlO1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcykge1xuIFx0XHRpZiAoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdIHx8ICFob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSlcbiBcdFx0XHRyZXR1cm47XG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XG4gXHRcdGZvciAodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZiAoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xuIFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdGlmICghaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0pIHtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdFVwZGF0ZURvd25sb2FkZWQoKSB7XG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcbiBcdFx0aG90RGVmZXJyZWQgPSBudWxsO1xuIFx0XHRpZiAoIWRlZmVycmVkKSByZXR1cm47XG4gXHRcdGlmIChob3RBcHBseU9uVXBkYXRlKSB7XG4gXHRcdFx0Ly8gV3JhcCBkZWZlcnJlZCBvYmplY3QgaW4gUHJvbWlzZSB0byBtYXJrIGl0IGFzIGEgd2VsbC1oYW5kbGVkIFByb21pc2UgdG9cbiBcdFx0XHQvLyBhdm9pZCB0cmlnZ2VyaW5nIHVuY2F1Z2h0IGV4Y2VwdGlvbiB3YXJuaW5nIGluIENocm9tZS5cbiBcdFx0XHQvLyBTZWUgaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDY1NjY2XG4gXHRcdFx0UHJvbWlzZS5yZXNvbHZlKClcbiBcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gaG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSk7XG4gXHRcdFx0XHR9KVxuIFx0XHRcdFx0LnRoZW4oXG4gXHRcdFx0XHRcdGZ1bmN0aW9uKHJlc3VsdCkge1xuIFx0XHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcbiBcdFx0XHRcdFx0fSxcbiBcdFx0XHRcdFx0ZnVuY3Rpb24oZXJyKSB7XG4gXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdCk7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHRcdGZvciAodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xuIFx0XHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaCh0b01vZHVsZUlkKGlkKSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHRcdGRlZmVycmVkLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XG4gXHRcdGlmIChob3RTdGF0dXMgIT09IFwicmVhZHlcIilcbiBcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXNcIik7XG4gXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gXHRcdHZhciBjYjtcbiBcdFx0dmFyIGk7XG4gXHRcdHZhciBqO1xuIFx0XHR2YXIgbW9kdWxlO1xuIFx0XHR2YXIgbW9kdWxlSWQ7XG5cbiBcdFx0ZnVuY3Rpb24gZ2V0QWZmZWN0ZWRTdHVmZih1cGRhdGVNb2R1bGVJZCkge1xuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLm1hcChmdW5jdGlvbihpZCkge1xuIFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0Y2hhaW46IFtpZF0sXG4gXHRcdFx0XHRcdGlkOiBpZFxuIFx0XHRcdFx0fTtcbiBcdFx0XHR9KTtcbiBcdFx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuIFx0XHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xuIFx0XHRcdFx0dmFyIGNoYWluID0gcXVldWVJdGVtLmNoYWluO1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAoIW1vZHVsZSB8fCBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0aWYgKG1vZHVsZS5ob3QuX3NlbGZEZWNsaW5lZCkge1xuIFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChtb2R1bGUuaG90Ll9tYWluKSB7XG4gXHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcbiBcdFx0XHRcdFx0dmFyIHBhcmVudCA9IGluc3RhbGxlZE1vZHVsZXNbcGFyZW50SWRdO1xuIFx0XHRcdFx0XHRpZiAoIXBhcmVudCkgY29udGludWU7XG4gXHRcdFx0XHRcdGlmIChwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkZWNsaW5lZFwiLFxuIFx0XHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdHBhcmVudElkOiBwYXJlbnRJZFxuIFx0XHRcdFx0XHRcdH07XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSAhPT0gLTEpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRpZiAocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcbiBcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0sIFttb2R1bGVJZF0pO1xuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF07XG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcbiBcdFx0XHRcdFx0XHRpZDogcGFyZW50SWRcbiBcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuXG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcbiBcdFx0XHRcdG91dGRhdGVkTW9kdWxlczogb3V0ZGF0ZWRNb2R1bGVzLFxuIFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXG4gXHRcdFx0fTtcbiBcdFx0fVxuXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcbiBcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcbiBcdFx0XHRcdGlmIChhLmluZGV4T2YoaXRlbSkgPT09IC0xKSBhLnB1c2goaXRlbSk7XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gYXQgYmVnaW4gYWxsIHVwZGF0ZXMgbW9kdWxlcyBhcmUgb3V0ZGF0ZWRcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcbiBcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xuXG4gXHRcdHZhciB3YXJuVW5leHBlY3RlZFJlcXVpcmUgPSBmdW5jdGlvbiB3YXJuVW5leHBlY3RlZFJlcXVpcmUoKSB7XG4gXHRcdFx0Y29uc29sZS53YXJuKFxuIFx0XHRcdFx0XCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIikgdG8gZGlzcG9zZWQgbW9kdWxlXCJcbiBcdFx0XHQpO1xuIFx0XHR9O1xuXG4gXHRcdGZvciAodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcbiBcdFx0XHRcdG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XG4gXHRcdFx0XHQvKiogQHR5cGUge1RPRE99ICovXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xuIFx0XHRcdFx0aWYgKGhvdFVwZGF0ZVtpZF0pIHtcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRyZXN1bHQgPSB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBpZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0LyoqIEB0eXBlIHtFcnJvcnxmYWxzZX0gKi9cbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XG4gXHRcdFx0XHRpZiAocmVzdWx0LmNoYWluKSB7XG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdHN3aXRjaCAocmVzdWx0LnR5cGUpIHtcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0XCIgaW4gXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5wYXJlbnRJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uVW5hY2NlcHRlZCkgb3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25BY2NlcHRlZCkgb3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGlzcG9zZWQpIG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGRlZmF1bHQ6XG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChhYm9ydEVycm9yKSB7XG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xuIFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYWJvcnRFcnJvcik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoZG9BcHBseSkge1xuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdFx0XHRcdGZvciAobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0XHRcdFx0aWYgKFxuIFx0XHRcdFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKFxuIFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHRcdFx0XHQpXG4gXHRcdFx0XHRcdFx0KSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XG4gXHRcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLFxuIFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvRGlzcG9zZSkge1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJlxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWQgJiZcbiBcdFx0XHRcdC8vIHJlbW92ZWQgc2VsZi1hY2NlcHRlZCBtb2R1bGVzIHNob3VsZCBub3QgYmUgcmVxdWlyZWRcbiBcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdICE9PSB3YXJuVW5leHBlY3RlZFJlcXVpcmVcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcbiBcdFx0XHRcdFx0bW9kdWxlOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxuIFx0XHRcdFx0fSk7XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XG4gXHRcdE9iamVjdC5rZXlzKGhvdEF2YWlsYWJsZUZpbGVzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rSWQpIHtcbiBcdFx0XHRpZiAoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XG4gXHRcdFx0XHRob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0fVxuIFx0XHR9KTtcblxuIFx0XHR2YXIgaWR4O1xuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcbiBcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xuIFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdGlmICghbW9kdWxlKSBjb250aW51ZTtcblxuIFx0XHRcdHZhciBkYXRhID0ge307XG5cbiBcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xuIFx0XHRcdFx0Y2IoZGF0YSk7XG4gXHRcdFx0fVxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XG5cbiBcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XG5cbiBcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyB3aGVuIGRpc3Bvc2luZyB0aGVyZSBpcyBubyBuZWVkIHRvIGNhbGwgZGlzcG9zZSBoYW5kbGVyXG4gXHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcblxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXG4gXHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xuIFx0XHRcdFx0aWYgKCFjaGlsZCkgY29udGludWU7XG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSB7XG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cbiBcdFx0dmFyIGRlcGVuZGVuY3k7XG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcbiBcdFx0XHRcdFx0XHRpZiAoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIE5vdyBpbiBcImFwcGx5XCIgcGhhc2VcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XG5cbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xuXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxuIFx0XHRmb3IgKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xuIFx0XHRmb3IgKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZClcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKG1vZHVsZSkge1xuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xuIFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XG4gXHRcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcbiBcdFx0XHRcdFx0XHRpZiAoY2IpIHtcbiBcdFx0XHRcdFx0XHRcdGlmIChjYWxsYmFja3MuaW5kZXhPZihjYikgIT09IC0xKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGNiKTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xuIFx0XHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XG4gXHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcbiBcdFx0Zm9yIChpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xuIFx0XHRcdG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xuIFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcbiBcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdGlmICh0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xuIFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVycik7XG4gXHRcdFx0XHRcdH0gY2F0Y2ggKGVycjIpIHtcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcbiBcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyMjtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxuIFx0XHRpZiAoZXJyb3IpIHtcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gXHRcdH1cblxuIFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoMCkoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cGRhdGVkTW9kdWxlcywgcmVuZXdlZE1vZHVsZXMpIHtcblx0dmFyIHVuYWNjZXB0ZWRNb2R1bGVzID0gdXBkYXRlZE1vZHVsZXMuZmlsdGVyKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0cmV0dXJuIHJlbmV3ZWRNb2R1bGVzICYmIHJlbmV3ZWRNb2R1bGVzLmluZGV4T2YobW9kdWxlSWQpIDwgMDtcblx0fSk7XG5cdHZhciBsb2cgPSByZXF1aXJlKFwiLi9sb2dcIik7XG5cblx0aWYgKHVuYWNjZXB0ZWRNb2R1bGVzLmxlbmd0aCA+IDApIHtcblx0XHRsb2coXG5cdFx0XHRcIndhcm5pbmdcIixcblx0XHRcdFwiW0hNUl0gVGhlIGZvbGxvd2luZyBtb2R1bGVzIGNvdWxkbid0IGJlIGhvdCB1cGRhdGVkOiAoVGhleSB3b3VsZCBuZWVkIGEgZnVsbCByZWxvYWQhKVwiXG5cdFx0KTtcblx0XHR1bmFjY2VwdGVkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoIXJlbmV3ZWRNb2R1bGVzIHx8IHJlbmV3ZWRNb2R1bGVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSBOb3RoaW5nIGhvdCB1cGRhdGVkLlwiKTtcblx0fSBlbHNlIHtcblx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gVXBkYXRlZCBtb2R1bGVzOlwiKTtcblx0XHRyZW5ld2VkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0XHRpZiAodHlwZW9mIG1vZHVsZUlkID09PSBcInN0cmluZ1wiICYmIG1vZHVsZUlkLmluZGV4T2YoXCIhXCIpICE9PSAtMSkge1xuXHRcdFx0XHR2YXIgcGFydHMgPSBtb2R1bGVJZC5zcGxpdChcIiFcIik7XG5cdFx0XHRcdGxvZy5ncm91cENvbGxhcHNlZChcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIHBhcnRzLnBvcCgpKTtcblx0XHRcdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdFx0XHRsb2cuZ3JvdXBFbmQoXCJpbmZvXCIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHZhciBudW1iZXJJZHMgPSByZW5ld2VkTW9kdWxlcy5ldmVyeShmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdFx0cmV0dXJuIHR5cGVvZiBtb2R1bGVJZCA9PT0gXCJudW1iZXJcIjtcblx0XHR9KTtcblx0XHRpZiAobnVtYmVySWRzKVxuXHRcdFx0bG9nKFxuXHRcdFx0XHRcImluZm9cIixcblx0XHRcdFx0XCJbSE1SXSBDb25zaWRlciB1c2luZyB0aGUgTmFtZWRNb2R1bGVzUGx1Z2luIGZvciBtb2R1bGUgbmFtZXMuXCJcblx0XHRcdCk7XG5cdH1cbn07XG4iLCJ2YXIgbG9nTGV2ZWwgPSBcImluZm9cIjtcblxuZnVuY3Rpb24gZHVtbXkoKSB7fVxuXG5mdW5jdGlvbiBzaG91bGRMb2cobGV2ZWwpIHtcblx0dmFyIHNob3VsZExvZyA9XG5cdFx0KGxvZ0xldmVsID09PSBcImluZm9cIiAmJiBsZXZlbCA9PT0gXCJpbmZvXCIpIHx8XG5cdFx0KFtcImluZm9cIiwgXCJ3YXJuaW5nXCJdLmluZGV4T2YobG9nTGV2ZWwpID49IDAgJiYgbGV2ZWwgPT09IFwid2FybmluZ1wiKSB8fFxuXHRcdChbXCJpbmZvXCIsIFwid2FybmluZ1wiLCBcImVycm9yXCJdLmluZGV4T2YobG9nTGV2ZWwpID49IDAgJiYgbGV2ZWwgPT09IFwiZXJyb3JcIik7XG5cdHJldHVybiBzaG91bGRMb2c7XG59XG5cbmZ1bmN0aW9uIGxvZ0dyb3VwKGxvZ0ZuKSB7XG5cdHJldHVybiBmdW5jdGlvbihsZXZlbCwgbXNnKSB7XG5cdFx0aWYgKHNob3VsZExvZyhsZXZlbCkpIHtcblx0XHRcdGxvZ0ZuKG1zZyk7XG5cdFx0fVxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxldmVsLCBtc2cpIHtcblx0aWYgKHNob3VsZExvZyhsZXZlbCkpIHtcblx0XHRpZiAobGV2ZWwgPT09IFwiaW5mb1wiKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhtc2cpO1xuXHRcdH0gZWxzZSBpZiAobGV2ZWwgPT09IFwid2FybmluZ1wiKSB7XG5cdFx0XHRjb25zb2xlLndhcm4obXNnKTtcblx0XHR9IGVsc2UgaWYgKGxldmVsID09PSBcImVycm9yXCIpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IobXNnKTtcblx0XHR9XG5cdH1cbn07XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGlucyAqL1xudmFyIGdyb3VwID0gY29uc29sZS5ncm91cCB8fCBkdW1teTtcbnZhciBncm91cENvbGxhcHNlZCA9IGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQgfHwgZHVtbXk7XG52YXIgZ3JvdXBFbmQgPSBjb25zb2xlLmdyb3VwRW5kIHx8IGR1bW15O1xuLyogZXNsaW50LWVuYWJsZSBub2RlL25vLXVuc3VwcG9ydGVkLWZlYXR1cmVzL25vZGUtYnVpbHRpbnMgKi9cblxubW9kdWxlLmV4cG9ydHMuZ3JvdXAgPSBsb2dHcm91cChncm91cCk7XG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwQ29sbGFwc2VkID0gbG9nR3JvdXAoZ3JvdXBDb2xsYXBzZWQpO1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cEVuZCA9IGxvZ0dyb3VwKGdyb3VwRW5kKTtcblxubW9kdWxlLmV4cG9ydHMuc2V0TG9nTGV2ZWwgPSBmdW5jdGlvbihsZXZlbCkge1xuXHRsb2dMZXZlbCA9IGxldmVsO1xufTtcblxubW9kdWxlLmV4cG9ydHMuZm9ybWF0RXJyb3IgPSBmdW5jdGlvbihlcnIpIHtcblx0dmFyIG1lc3NhZ2UgPSBlcnIubWVzc2FnZTtcblx0dmFyIHN0YWNrID0gZXJyLnN0YWNrO1xuXHRpZiAoIXN0YWNrKSB7XG5cdFx0cmV0dXJuIG1lc3NhZ2U7XG5cdH0gZWxzZSBpZiAoc3RhY2suaW5kZXhPZihtZXNzYWdlKSA8IDApIHtcblx0XHRyZXR1cm4gbWVzc2FnZSArIFwiXFxuXCIgKyBzdGFjaztcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gc3RhY2s7XG5cdH1cbn07XG4iLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLypnbG9iYWxzIF9fcmVzb3VyY2VRdWVyeSAqL1xuaWYgKG1vZHVsZS5ob3QpIHtcblx0dmFyIGhvdFBvbGxJbnRlcnZhbCA9ICtfX3Jlc291cmNlUXVlcnkuc3Vic3RyKDEpIHx8IDEwICogNjAgKiAxMDAwO1xuXHR2YXIgbG9nID0gcmVxdWlyZShcIi4vbG9nXCIpO1xuXG5cdHZhciBjaGVja0ZvclVwZGF0ZSA9IGZ1bmN0aW9uIGNoZWNrRm9yVXBkYXRlKGZyb21VcGRhdGUpIHtcblx0XHRpZiAobW9kdWxlLmhvdC5zdGF0dXMoKSA9PT0gXCJpZGxlXCIpIHtcblx0XHRcdG1vZHVsZS5ob3Rcblx0XHRcdFx0LmNoZWNrKHRydWUpXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0XHRcdFx0aWYgKCF1cGRhdGVkTW9kdWxlcykge1xuXHRcdFx0XHRcdFx0aWYgKGZyb21VcGRhdGUpIGxvZyhcImluZm9cIiwgXCJbSE1SXSBVcGRhdGUgYXBwbGllZC5cIik7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlcXVpcmUoXCIuL2xvZy1hcHBseS1yZXN1bHRcIikodXBkYXRlZE1vZHVsZXMsIHVwZGF0ZWRNb2R1bGVzKTtcblx0XHRcdFx0XHRjaGVja0ZvclVwZGF0ZSh0cnVlKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uKGVycikge1xuXHRcdFx0XHRcdHZhciBzdGF0dXMgPSBtb2R1bGUuaG90LnN0YXR1cygpO1xuXHRcdFx0XHRcdGlmIChbXCJhYm9ydFwiLCBcImZhaWxcIl0uaW5kZXhPZihzdGF0dXMpID49IDApIHtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBDYW5ub3QgYXBwbHkgdXBkYXRlLlwiKTtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBcIiArIGxvZy5mb3JtYXRFcnJvcihlcnIpKTtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBZb3UgbmVlZCB0byByZXN0YXJ0IHRoZSBhcHBsaWNhdGlvbiFcIik7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBVcGRhdGUgZmFpbGVkOiBcIiArIGxvZy5mb3JtYXRFcnJvcihlcnIpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblx0c2V0SW50ZXJ2YWwoY2hlY2tGb3JVcGRhdGUsIGhvdFBvbGxJbnRlcnZhbCk7XG59IGVsc2Uge1xuXHR0aHJvdyBuZXcgRXJyb3IoXCJbSE1SXSBIb3QgTW9kdWxlIFJlcGxhY2VtZW50IGlzIGRpc2FibGVkLlwiKTtcbn1cbiIsInJlcXVpcmUoXCJkb3RlbnZcIikuY29uZmlnKCk7XHJcbmltcG9ydCBcInJlZmxlY3QtbWV0YWRhdGFcIjtcclxuaW1wb3J0IHsgR3JhcGhRTFNlcnZlciB9IGZyb20gXCJncmFwaHFsLXlvZ2FcIjtcclxuaW1wb3J0IHsgYnVpbGRTY2hlbWEgfSBmcm9tIFwidHlwZS1ncmFwaHFsXCI7XHJcbi8vIGltcG9ydCB7IEdhbWVEZXRhaWxzUmVzb2x2ZXIgfSBmcm9tICcuL3Jlc29sdmVycy9HYW1lRGV0YWlsUmVzb2x2ZXInO1xyXG4vLyBpbXBvcnQge0dhbWVSZXNvbHZlciB9IGZyb21cclxuaW1wb3J0IEFnZ0dhbWVTdGF0UmVzb2x2ZXIgZnJvbSBcIi4vcmVzb2x2ZXJzL0FnZ0dhbWVTdGF0UmVzb2x2ZXJcIjtcclxuaW1wb3J0IFBsYXllclJlc29sdmVyIGZyb20gXCIuL3Jlc29sdmVycy9QbGF5ZXJSZXNvbHZlclwiO1xyXG5pbXBvcnQgR2FtZVJlc29sdmVyIGZyb20gXCIuL3Jlc29sdmVycy9HYW1lUmVzb2x2ZXJcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuXHJcbmltcG9ydCBuZmxHYW1lIGZyb20gXCIuL25mbGdhbWUvbmZsZ2FtZVwiO1xyXG5cclxubmZsR2FtZS5nZXRJbnN0YW5jZShwcm9jZXNzLmVudi5DQUNIRV9QQVRIKTtcclxuXHJcbi8vIC8vIEdSQVBIUUwgUE9SVElPTlxyXG5hc3luYyBmdW5jdGlvbiBib290c3RyYXAoKSB7XHJcbiAgY29uc3Qgc2NoZW1hID0gYXdhaXQgYnVpbGRTY2hlbWEoe1xyXG4gICAgcmVzb2x2ZXJzOiBbQWdnR2FtZVN0YXRSZXNvbHZlciwgUGxheWVyUmVzb2x2ZXIsIEdhbWVSZXNvbHZlcl0sXHJcbiAgICB2YWxpZGF0ZTogZmFsc2UsXHJcbiAgICBlbWl0U2NoZW1hRmlsZTogdHJ1ZVxyXG4gIH0pO1xyXG5cclxuICBjb25zdCBzZXJ2ZXIgPSBuZXcgR3JhcGhRTFNlcnZlcih7XHJcbiAgICBzY2hlbWFcclxuICB9KTtcclxuXHJcbiAgc2VydmVyLnN0YXJ0KCgpID0+IGNvbnNvbGUubG9nKFwiU2VydmVyIGlzIHJ1bm5pbmcgb24gaHR0cDovL2xvY2FsaG9zdDo0MDAwXCIpKTtcclxufVxyXG5cclxuYm9vdHN0cmFwKCk7XHJcblxyXG4vLyBuZmxHYW1lLmdldEluc3RhbmNlKCkuc2VhcmNoU2NoZWR1bGUoe2hvbWU6ICdOWUcnLCB5ZWFyOiAyMDExfSkudGhlbigocmVzdWx0KSA9PiB7XHJcbi8vICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG4vLyB9KVxyXG5cclxuLy8gSFJNXHJcbmlmIChtb2R1bGUuaG90KSB7XHJcbiAgbW9kdWxlLmhvdC5hY2NlcHQoKTtcclxuICBtb2R1bGUuaG90LmRpc3Bvc2UoKCkgPT4gY29uc29sZS5sb2coXCJNb2R1bGUgZGlzcG9zZWQuIFwiKSk7XHJcbn1cclxuXHJcbi8vIGNsYXNzIE5mbGdhbWUge1xyXG4vLyAgICAgdGVhbXMgPSBbXHJcbi8vICAgICAgICAgWydBUkknLCAnQXJpem9uYScsICdDYXJkaW5hbHMnLCAnQXJpem9uYSBDYXJkaW5hbHMnXSxcclxuLy8gICAgICAgICBbJ0FUTCcsICdBdGxhbnRhJywgJ0ZhbGNvbnMnLCAnQXRsYW50YSBGYWxjb25zJ10sXHJcbi8vICAgICAgICAgWydCQUwnLCAnQmFsdGltb3JlJywgJ1JhdmVucycsICdCYWx0aW1vcmUgUmF2ZW5zJ10sXHJcbi8vICAgICAgICAgWydCVUYnLCAnQnVmZmFsbycsICdCaWxscycsICdCdWZmYWxvIEJpbGxzJ10sXHJcbi8vICAgICAgICAgWydDQVInLCAnQ2Fyb2xpbmEnLCAnUGFudGhlcnMnLCAnQ2Fyb2xpbmEgUGFudGhlcnMnXSxcclxuLy8gICAgICAgICBbJ0NISScsICdDaGljYWdvJywgJ0JlYXJzJywgJ0NoaWNhZ28gQmVhcnMnXSxcclxuLy8gICAgICAgICBbJ0NJTicsICdDaW5jaW5uYXRpJywgJ0JlbmdhbHMnLCAnQ2luY2lubmF0aSBCZW5nYWxzJ10sXHJcbi8vICAgICAgICAgWydDTEUnLCAnQ2xldmVsYW5kJywgJ0Jyb3ducycsICdDbGV2ZWxhbmQgQnJvd25zJ10sXHJcbi8vICAgICAgICAgWydEQUwnLCAnRGFsbGFzJywgJ0Nvd2JveXMnLCAnRGFsbGFzIENvd2JveXMnXSxcclxuLy8gICAgICAgICBbJ0RFTicsICdEZW52ZXInLCAnQnJvbmNvcycsICdEZW52ZXIgQnJvbmNvcyddLFxyXG4vLyAgICAgICAgIFsnREVUJywgJ0RldHJvaXQnLCAnTGlvbnMnLCAnRGV0cm9pdCBMaW9ucyddLFxyXG4vLyAgICAgICAgIFsnR0InLCAnR3JlZW4gQmF5JywgJ1BhY2tlcnMnLCAnR3JlZW4gQmF5IFBhY2tlcnMnLCAnR05CJ10sXHJcbi8vICAgICAgICAgWydIT1UnLCAnSG91c3RvbicsICdUZXhhbnMnLCAnSG91c3RvbiBUZXhhbnMnXSxcclxuLy8gICAgICAgICBbJ0lORCcsICdJbmRpYW5hcG9saXMnLCAnQ29sdHMnLCAnSW5kaWFuYXBvbGlzIENvbHRzJ10sXHJcbi8vICAgICAgICAgWydKQUMnLCAnSmFja3NvbnZpbGxlJywgJ0phZ3VhcnMnLCAnSmFja3NvbnZpbGxlIEphZ3VhcnMnLCAnSkFYJ10sXHJcbi8vICAgICAgICAgWydLQycsICdLYW5zYXMgQ2l0eScsICdDaGllZnMnLCAnS2Fuc2FzIENpdHkgQ2hpZWZzJywgJ0tBTiddLFxyXG4vLyAgICAgICAgIFsnTEEnLCAnTG9zIEFuZ2VsZXMnLCAnUmFtcycsICdMb3MgQW5nZWxlcyBSYW1zJywgJ0xBUiddLFxyXG4vLyAgICAgICAgIFsnU0QnLCAnU2FuIERpZWdvJywgJ0NoYXJnZXJzJywgJ1NhbiBEaWVnbyBDaGFyZ2VycycsICdTREcnXSxcclxuLy8gICAgICAgICBbJ0xBQycsICdMb3MgQW5nZWxlcyBDJywgJ0NoYXJnZXJzJywgJ0xvcyBBbmdlbGVzIENoYXJnZXJzJywgJ0xBQyddLFxyXG4vLyAgICAgICAgIFsnTUlBJywgJ01pYW1pJywgJ0RvbHBoaW5zJywgJ01pYW1pIERvbHBoaW5zJ10sXHJcbi8vICAgICAgICAgWydNSU4nLCAnTWlubmVzb3RhJywgJ1Zpa2luZ3MnLCAnTWlubmVzb3RhIFZpa2luZ3MnXSxcclxuLy8gICAgICAgICBbJ05FJywgJ05ldyBFbmdsYW5kJywgJ1BhdHJpb3RzJywgJ05ldyBFbmdsYW5kIFBhdHJpb3RzJywgJ05XRSddLFxyXG4vLyAgICAgICAgIFsnTk8nLCAnTmV3IE9ybGVhbnMnLCAnU2FpbnRzJywgJ05ldyBPcmxlYW5zIFNhaW50cycsICdOT1InXSxcclxuLy8gICAgICAgICBbJ05ZRycsICdOZXcgWW9yayBHJywgJ0dpYW50cycsICdOZXcgWW9yayBHaWFudHMnXSxcclxuLy8gICAgICAgICBbJ05ZSicsICdOZXcgWW9yayBKJywgJ0pldHMnLCAnTmV3IFlvcmsgSmV0cyddLFxyXG4vLyAgICAgICAgIFsnT0FLJywgJ09ha2xhbmQnLCAnUmFpZGVycycsICdPYWtsYW5kIFJhaWRlcnMnXSxcclxuLy8gICAgICAgICBbJ1BISScsICdQaGlsYWRlbHBoaWEnLCAnRWFnbGVzJywgJ1BoaWxhZGVscGhpYSBFYWdsZXMnXSxcclxuLy8gICAgICAgICBbJ1BJVCcsICdQaXR0c2J1cmdoJywgJ1N0ZWVsZXJzJywgJ1BpdHRzYnVyZ2ggU3RlZWxlcnMnXSxcclxuLy8gICAgICAgICBbJ1NFQScsICdTZWF0dGxlJywgJ1NlYWhhd2tzJywgJ1NlYXR0bGUgU2VhaGF3a3MnXSxcclxuLy8gICAgICAgICBbJ1NGJywgJ1NhbiBGcmFuY2lzY28nLCAnNDllcnMnLCAnU2FuIEZyYW5jaXNjbyA0OWVycycsICdTRk8nXSxcclxuLy8gICAgICAgICBbJ1NUTCcsICdTdC4gTG91aXMnLCAnUmFtcycsICdTdC4gTG91aXMgUmFtcyddLFxyXG4vLyAgICAgICAgIFsnVEInLCAnVGFtcGEgQmF5JywgJ0J1Y2NhbmVlcnMnLCAnVGFtcGEgQmF5IEJ1Y2NhbmVlcnMnLCAnVEFNJ10sXHJcbi8vICAgICAgICAgWydURU4nLCAnVGVubmVzc2VlJywgJ1RpdGFucycsICdUZW5uZXNzZWUgVGl0YW5zJ10sXHJcbi8vICAgICAgICAgWydXQVMnLCAnV2FzaGluZ3RvbicsICdSZWRza2lucycsICdXYXNoaW5ndG9uIFJlZHNraW5zJywgJ1dTSCddLFxyXG4vLyAgICAgXVxyXG4vLyB9XHJcbiIsImltcG9ydCB7IG5mbEFwaUdhbWUsIG5mbEFnZ0dhbWVTdGF0cyB9IGZyb20gXCIuLi9zY2hlbWFzL25mbEFwaUdhbWVcIjtcclxuaW1wb3J0IHsgQWdnR2FtZVN0YXQgfSBmcm9tIFwiLi4vc2NoZW1hcy9BZ2dHYW1lU3RhdFwiO1xyXG5pbXBvcnQgR2FtZURldGFpbHMgZnJvbSBcIi4uL3NjaGVtYXMvR2FtZURldGFpbHNcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGF5ZXJTdGF0cyhuZmxHYW1lOiBuZmxBcGlHYW1lIHwgbnVsbCkge1xyXG4gIGlmIChuZmxHYW1lID09IG51bGwpIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9IGVsc2Uge1xyXG4gICAgY29uc3QgaG9tZSA9IG5mbEdhbWUuaG9tZS5zdGF0cztcclxuICAgIGNvbnN0IGF3YXkgPSBuZmxHYW1lLmF3YXkuc3RhdHM7XHJcbiAgICByZXR1cm4gZmxhdHRlblN0YXRzKGhvbWUpLmNvbmNhdChmbGF0dGVuU3RhdHMoYXdheSkpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZmxhdHRlblN0YXRzKHN0YXRzOiBuZmxBZ2dHYW1lU3RhdHMpIHtcclxuICAvLyB2ZXJib3NlLCBidXQgY2xlYXJlci4gU2hvdWxkIHJlZmFjdG9yXHJcblxyXG4gIGNvbnN0IHBsYXllclN0YXRzOiBBZ2dHYW1lU3RhdFtdID0gW107XHJcblxyXG4gIGlmIChzdGF0cy5wYXNzaW5nKSB7XHJcbiAgICBPYmplY3Qua2V5cyhzdGF0cy5wYXNzaW5nKS5mb3JFYWNoKHBsYXllcklkID0+IHtcclxuICAgICAgY29uc3Qgc3RhdCA9IHtcclxuICAgICAgICBwbGF5ZXJJZDogcGxheWVySWQsXHJcbiAgICAgICAgY2F0ZWdvcnk6IFwicGFzc2luZ1wiLFxyXG4gICAgICAgIG5hbWU6IHN0YXRzLnBhc3NpbmdbcGxheWVySWRdLm5hbWUsXHJcbiAgICAgICAgcGFzc2luZ19hdHQ6IHN0YXRzLnBhc3NpbmdbcGxheWVySWRdLmF0dCxcclxuICAgICAgICBwYXNzaW5nX2NtcDogc3RhdHMucGFzc2luZ1twbGF5ZXJJZF0uY21wLFxyXG4gICAgICAgIHBhc3NpbmdfeWRzOiBzdGF0cy5wYXNzaW5nW3BsYXllcklkXS55ZHMsXHJcbiAgICAgICAgcGFzc2luZ190ZHM6IHN0YXRzLnBhc3NpbmdbcGxheWVySWRdLnRkcyxcclxuICAgICAgICBwYXNzaW5nX2ludHM6IHN0YXRzLnBhc3NpbmdbcGxheWVySWRdLmludHMsXHJcbiAgICAgICAgcGFzc2luZ190d29wdGE6IHN0YXRzLnBhc3NpbmdbcGxheWVySWRdLnR3b3B0YSxcclxuICAgICAgICBwYXNzaW5nX3R3b3B0bTogc3RhdHMucGFzc2luZ1twbGF5ZXJJZF0udHdvcHRtXHJcbiAgICAgIH07XHJcbiAgICAgIHBsYXllclN0YXRzLnB1c2goc3RhdCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGlmIChzdGF0cy5ydXNoaW5nKSB7XHJcbiAgICBPYmplY3Qua2V5cyhzdGF0cy5ydXNoaW5nKS5mb3JFYWNoKHBsYXllcklkID0+IHtcclxuICAgICAgY29uc3Qgc3RhdCA9IHtcclxuICAgICAgICBwbGF5ZXJJZDogcGxheWVySWQsXHJcbiAgICAgICAgY2F0ZWdvcnk6IFwicnVzaGluZ1wiLFxyXG4gICAgICAgIG5hbWU6IHN0YXRzLnJ1c2hpbmdbcGxheWVySWRdLm5hbWUsXHJcbiAgICAgICAgcnVzaGluZ19hdHQ6IHN0YXRzLnJ1c2hpbmdbcGxheWVySWRdLmF0dCxcclxuICAgICAgICBydXNoaW5nX3lkczogc3RhdHMucnVzaGluZ1twbGF5ZXJJZF0ueWRzLFxyXG4gICAgICAgIHJ1c2hpbmdfdGRzOiBzdGF0cy5ydXNoaW5nW3BsYXllcklkXS50ZHMsXHJcbiAgICAgICAgcnVzaGluZ19sbmc6IHN0YXRzLnJ1c2hpbmdbcGxheWVySWRdLmxuZyxcclxuICAgICAgICBydXNoaW5nX2xuZ3RkOiBzdGF0cy5ydXNoaW5nW3BsYXllcklkXS5sbmd0ZCxcclxuICAgICAgICBydXNoaW5nX3R3b3B0YTogc3RhdHMucnVzaGluZ1twbGF5ZXJJZF0udHdvcHRhLFxyXG4gICAgICAgIHJ1c2hpbmdfdHdvcHRtOiBzdGF0cy5ydXNoaW5nW3BsYXllcklkXS50d29wdG1cclxuICAgICAgfTtcclxuICAgICAgcGxheWVyU3RhdHMucHVzaChzdGF0KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaWYgKHN0YXRzLnJlY2VpdmluZykge1xyXG4gICAgT2JqZWN0LmtleXMoc3RhdHMucmVjZWl2aW5nKS5mb3JFYWNoKHBsYXllcklkID0+IHtcclxuICAgICAgY29uc3Qgc3RhdCA9IHtcclxuICAgICAgICBwbGF5ZXJJZDogcGxheWVySWQsXHJcbiAgICAgICAgY2F0ZWdvcnk6IFwicmVjZWl2aW5nXCIsXHJcbiAgICAgICAgbmFtZTogc3RhdHMucmVjZWl2aW5nW3BsYXllcklkXS5uYW1lLFxyXG4gICAgICAgIHJlY2VpdmluZ19yZWM6IHN0YXRzLnJlY2VpdmluZ1twbGF5ZXJJZF0ucmVjLFxyXG4gICAgICAgIHJlY2VpdmluZ195ZHM6IHN0YXRzLnJlY2VpdmluZ1twbGF5ZXJJZF0ueWRzLFxyXG4gICAgICAgIHJlY2VpdmluZ190ZHM6IHN0YXRzLnJlY2VpdmluZ1twbGF5ZXJJZF0udGRzLFxyXG4gICAgICAgIHJlY2VpdmluZ19sbmc6IHN0YXRzLnJlY2VpdmluZ1twbGF5ZXJJZF0ubG5nLFxyXG4gICAgICAgIHJlY2VpdmluZ19sbmd0ZDogc3RhdHMucmVjZWl2aW5nW3BsYXllcklkXS5sbmd0ZCxcclxuICAgICAgICByZWNlaXZpbmdfdHdvcHRhOiBzdGF0cy5yZWNlaXZpbmdbcGxheWVySWRdLnR3b3B0YSxcclxuICAgICAgICByZWNlaXZpbmdfdHdvcHRtOiBzdGF0cy5yZWNlaXZpbmdbcGxheWVySWRdLnR3b3B0bVxyXG4gICAgICB9O1xyXG4gICAgICBwbGF5ZXJTdGF0cy5wdXNoKHN0YXQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpZiAoc3RhdHMuZnVtYmxlcykge1xyXG4gICAgT2JqZWN0LmtleXMoc3RhdHMuZnVtYmxlcykuZm9yRWFjaChwbGF5ZXJJZCA9PiB7XHJcbiAgICAgIGNvbnN0IHN0YXQgPSB7XHJcbiAgICAgICAgcGxheWVySWQ6IHBsYXllcklkLFxyXG4gICAgICAgIGNhdGVnb3J5OiBcImZ1bWJsZXNcIixcclxuICAgICAgICBuYW1lOiBzdGF0cy5mdW1ibGVzW3BsYXllcklkXS5uYW1lLFxyXG4gICAgICAgIGZ1bWJsZXNfZm9yY2VkOiBzdGF0cy5mdW1ibGVzW3BsYXllcklkXS5mb3JjZWQsXHJcbiAgICAgICAgZnVtYmxlc19sb3N0OiBzdGF0cy5mdW1ibGVzW3BsYXllcklkXS5sb3N0LFxyXG4gICAgICAgIGZ1bWJsZXNfbm90Zm9yY2VkOiBzdGF0cy5mdW1ibGVzW3BsYXllcklkXS5ub3Rmb3JjZWQsXHJcbiAgICAgICAgZnVtYmxlc19vb2I6IHN0YXRzLmZ1bWJsZXNbcGxheWVySWRdLm9vYixcclxuICAgICAgICBmdW1ibGVzX3JlYzogc3RhdHMuZnVtYmxlc1twbGF5ZXJJZF0ucmVjLFxyXG4gICAgICAgIGZ1bWJsZXNfcmVjX3lkczogc3RhdHMuZnVtYmxlc1twbGF5ZXJJZF0ucmVjX3lkcyxcclxuICAgICAgICBmdW1ibGVzX3RvdDogc3RhdHMuZnVtYmxlc1twbGF5ZXJJZF0udG90LFxyXG4gICAgICAgIGZ1bWJsZXNfcmVjX3Rkczogc3RhdHMuZnVtYmxlc1twbGF5ZXJJZF0ucmVjX3Rkc1xyXG4gICAgICB9O1xyXG4gICAgICBwbGF5ZXJTdGF0cy5wdXNoKHN0YXQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpZiAoc3RhdHMua2lja2luZykge1xyXG4gICAgT2JqZWN0LmtleXMoc3RhdHMua2lja2luZykuZm9yRWFjaChwbGF5ZXJJZCA9PiB7XHJcbiAgICAgIGNvbnN0IHN0YXQgPSB7XHJcbiAgICAgICAgcGxheWVySWQ6IHBsYXllcklkLFxyXG4gICAgICAgIGNhdGVnb3J5OiBcImtpY2tpbmdcIixcclxuICAgICAgICBuYW1lOiBzdGF0cy5raWNraW5nW3BsYXllcklkXS5uYW1lLFxyXG4gICAgICAgIGtpY2tpbmdfZmdtOiBzdGF0cy5raWNraW5nW3BsYXllcklkXS5mZ20sXHJcbiAgICAgICAga2lja2luZ19mZ2E6IHN0YXRzLmtpY2tpbmdbcGxheWVySWRdLmZnYSxcclxuICAgICAgICBraWNraW5nX2ZneWRzOiBzdGF0cy5raWNraW5nW3BsYXllcklkXS5mZ3lkcyxcclxuICAgICAgICBraWNraW5nX3RvdHBmZzogc3RhdHMua2lja2luZ1twbGF5ZXJJZF0udG90cGZnLFxyXG4gICAgICAgIGtpY2tpbmdfeHBtYWRlOiBzdGF0cy5raWNraW5nW3BsYXllcklkXS54cG1hZGUsXHJcbiAgICAgICAga2lja2luZ194cGE6IHN0YXRzLmtpY2tpbmdbcGxheWVySWRdLnhwYSxcclxuICAgICAgICBraWNraW5nX3hwYjogc3RhdHMua2lja2luZ1twbGF5ZXJJZF0ueHBiLFxyXG4gICAgICAgIGtpY2tpbmdfeHB0b3Q6IHN0YXRzLmtpY2tpbmdbcGxheWVySWRdLnhwdG90XHJcbiAgICAgIH07XHJcbiAgICAgIHBsYXllclN0YXRzLnB1c2goc3RhdCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGlmIChzdGF0cy5wdW50aW5nKSB7XHJcbiAgICBPYmplY3Qua2V5cyhzdGF0cy5wdW50aW5nKS5mb3JFYWNoKHBsYXllcklkID0+IHtcclxuICAgICAgY29uc3Qgc3RhdCA9IHtcclxuICAgICAgICBwbGF5ZXJJZDogcGxheWVySWQsXHJcbiAgICAgICAgY2F0ZWdvcnk6IFwicHVudGluZ1wiLFxyXG4gICAgICAgIG5hbWU6IHN0YXRzLnB1bnRpbmdbcGxheWVySWRdLm5hbWUsXHJcbiAgICAgICAgcHVudGluZ19wdHM6IHN0YXRzLnB1bnRpbmdbcGxheWVySWRdLnB0cyxcclxuICAgICAgICBwdW50aW5nX3lkczogc3RhdHMucHVudGluZ1twbGF5ZXJJZF0ueWRzLFxyXG4gICAgICAgIHB1bnRpbmdfYXZnOiBzdGF0cy5wdW50aW5nW3BsYXllcklkXS5hdmcsXHJcbiAgICAgICAgcHVudGluZ19pMjA6IHN0YXRzLnB1bnRpbmdbcGxheWVySWRdLmkyMCxcclxuICAgICAgICBwdW50aW5nX2xuZzogc3RhdHMucHVudGluZ1twbGF5ZXJJZF0ubG5nXHJcbiAgICAgIH07XHJcbiAgICAgIHBsYXllclN0YXRzLnB1c2goc3RhdCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGlmIChzdGF0cy5raWNrcmV0KSB7XHJcbiAgICBPYmplY3Qua2V5cyhzdGF0cy5raWNrcmV0KS5mb3JFYWNoKHBsYXllcklkID0+IHtcclxuICAgICAgY29uc3Qgc3RhdCA9IHtcclxuICAgICAgICBwbGF5ZXJJZDogcGxheWVySWQsXHJcbiAgICAgICAgY2F0ZWdvcnk6IFwia2lja3JldFwiLFxyXG4gICAgICAgIG5hbWU6IHN0YXRzLmtpY2tyZXRbcGxheWVySWRdLm5hbWUsXHJcbiAgICAgICAga2lja3JldF9yZXQ6IHN0YXRzLmtpY2tyZXRbcGxheWVySWRdLnJldCxcclxuICAgICAgICBraWNrcmV0X2F2Zzogc3RhdHMua2lja3JldFtwbGF5ZXJJZF0uYXZnLFxyXG4gICAgICAgIGtpY2tyZXRfdGRzOiBzdGF0cy5raWNrcmV0W3BsYXllcklkXS50ZHMsXHJcbiAgICAgICAga2lja3JldF9sbmc6IHN0YXRzLmtpY2tyZXRbcGxheWVySWRdLmxuZyxcclxuICAgICAgICBraWNrcmV0X2xuZ3RkOiBzdGF0cy5raWNrcmV0W3BsYXllcklkXS5sbmd0ZFxyXG4gICAgICB9O1xyXG4gICAgICBwbGF5ZXJTdGF0cy5wdXNoKHN0YXQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpZiAoc3RhdHMucHVudHJldCkge1xyXG4gICAgT2JqZWN0LmtleXMoc3RhdHMucHVudHJldCkuZm9yRWFjaChwbGF5ZXJJZCA9PiB7XHJcbiAgICAgIGNvbnN0IHN0YXQgPSB7XHJcbiAgICAgICAgcGxheWVySWQ6IHBsYXllcklkLFxyXG4gICAgICAgIGNhdGVnb3J5OiBcInB1bnRyZXRcIixcclxuICAgICAgICBuYW1lOiBzdGF0cy5wdW50cmV0W3BsYXllcklkXS5uYW1lLFxyXG4gICAgICAgIHB1bnRyZXRfcmV0OiBzdGF0cy5wdW50cmV0W3BsYXllcklkXS5yZXQsXHJcbiAgICAgICAgcHVudHJldF9hdmc6IHN0YXRzLnB1bnRyZXRbcGxheWVySWRdLmF2ZyxcclxuICAgICAgICBwdW50cmV0X3Rkczogc3RhdHMucHVudHJldFtwbGF5ZXJJZF0udGRzLFxyXG4gICAgICAgIHB1bnRyZXRfbG5nOiBzdGF0cy5wdW50cmV0W3BsYXllcklkXS5sbmcsXHJcbiAgICAgICAgcHVudHJldF9sbmd0ZDogc3RhdHMucHVudHJldFtwbGF5ZXJJZF0ubG5ndGRcclxuICAgICAgfTtcclxuICAgICAgcGxheWVyU3RhdHMucHVzaChzdGF0KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaWYgKHN0YXRzLmRlZmVuc2UpIHtcclxuICAgIE9iamVjdC5rZXlzKHN0YXRzLmRlZmVuc2UpLmZvckVhY2gocGxheWVySWQgPT4ge1xyXG4gICAgICBjb25zdCBzdGF0ID0ge1xyXG4gICAgICAgIHBsYXllcklkOiBwbGF5ZXJJZCxcclxuICAgICAgICBjYXRlZ29yeTogXCJkZWZlbnNlXCIsXHJcbiAgICAgICAgbmFtZTogc3RhdHMuZGVmZW5zZVtwbGF5ZXJJZF0ubmFtZSxcclxuICAgICAgICBkZWZlbnNlX3RrbDogc3RhdHMuZGVmZW5zZVtwbGF5ZXJJZF0udGtsLFxyXG4gICAgICAgIGRlZmVuc2VfYXN0OiBzdGF0cy5kZWZlbnNlW3BsYXllcklkXS5hc3QsXHJcbiAgICAgICAgZGVmZW5zZV9zazogc3RhdHMuZGVmZW5zZVtwbGF5ZXJJZF0uc2ssXHJcbiAgICAgICAgZGVmZW5zZV9pbnQ6IHN0YXRzLmRlZmVuc2VbcGxheWVySWRdLmludCxcclxuICAgICAgICBkZWZlbnNlX2ZmdW06IHN0YXRzLmRlZmVuc2VbcGxheWVySWRdLmZmdW1cclxuICAgICAgfTtcclxuICAgICAgcGxheWVyU3RhdHMucHVzaChzdGF0KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHBsYXllclN0YXRzO1xyXG59XHJcblxyXG4vLyBleHBvcnQgZnVuY3Rpb24gcGFyc2VHYW1lKGc6IG5mbEFwaUdhbWUpOiBHYW1lRGV0YWlscyB7XHJcbi8vICAgY29uc3QgZ2FtZTogR2FtZURldGFpbHMgPSB7XHJcbi8vICAgICB3ZWF0aGVyOiBnLndlYXRoZXIgPyBnLndlYXRoZXIgOiBcIlwiLFxyXG4vLyAgICAgbWVkaWE6IGcubWVkaWEgPyBnLm1lZGlhIDogXCJcIixcclxuLy8gICAgIHlsOiBnLnlsLFxyXG4vLyAgICAgcXRyOiBnLnF0cixcclxuLy8gICAgIG5vdGU6IGcubm90ZSA/IGcubm90ZSA6IFwiXCIsXHJcbi8vICAgICBkb3duOiBnLmRvd24sXHJcbi8vICAgICB0b2dvOiBnLnRvZ28sXHJcbi8vICAgICByZWR6b25lOiBnLnJlZHpvbmUsXHJcbi8vICAgICBjbG9jazogZy5jbG9jayxcclxuLy8gICAgIHBvc3RlYW06IGcucG9zdGVhbSxcclxuLy8gICAgIHN0YWRpdW06IGcuc3RhZGl1bSA/IGcuc3RhZGl1bSA6IFwiXCIsXHJcbi8vICAgICBob21lU2hvcnQ6IGcuaG9tZS5hYmJyLFxyXG4vLyAgICAgYXdheVNob3J0OiBnLmF3YXkuYWJicixcclxuLy8gICAgIGhvbWVTY29yZTogZy5ob21lLnNjb3JlLFxyXG4vLyAgICAgYXdheVNjb3JlOiBnLmF3YXkuc2NvcmVcclxuLy8gICB9O1xyXG5cclxuLy8gICByZXR1cm4gZ2FtZTtcclxuLy8gfVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdhbWVzR2VuKFxyXG4gIHllYXI6IG51bWJlcixcclxuICB3ZWVrPzogbnVtYmVyLFxyXG4gIGhvbWU/OiBzdHJpbmcsXHJcbiAgYXdheT86IHN0cmluZyxcclxuICBraW5kID0gXCJSRUdcIixcclxuICBzdGFydGVkID0gZmFsc2VcclxuKSB7XHJcbiAgLypcclxuICAgIGdhbWVzIHJldHVybnMgYSBnZW5lcmF0b3Igb2YgYWxsIGdhbWVzIG1hdGNoaW5nIHRoZSBnaXZlbiBjcml0ZXJpYS4gRWFjaFxyXG4gICAgZ2FtZSBjYW4gdGhlbiBiZSBxdWVyaWVkIGZvciBwbGF5ZXIgc3RhdGlzdGljcyBhbmQgaW5mb3JtYXRpb24gYWJvdXRcclxuICAgIHRoZSBnYW1lIGl0c2VsZiAoc2NvcmUsIHdpbm5lciwgc2NvcmluZyBwbGF5cywgZXRjLikuXHJcblxyXG4gICAgQXMgYSBzcGVjaWFsIGNhc2UsIGlmIHRoZSBob21lIGFuZCBhd2F5IHRlYW1zIGFyZSBzZXQgdG8gdGhlIHNhbWUgdGVhbSxcclxuICAgIHRoZW4gYWxsIGdhbWVzIHdoZXJlIHRoYXQgdGVhbSBwbGF5ZWQgYXJlIHJldHVybmVkLlxyXG5cclxuICAgIFRoZSBraW5kIHBhcmFtZXRlciBzcGVjaWZpZXMgd2hldGhlciB0byBmZXRjaCBwcmVzZWFzb24sIHJlZ3VsYXIgc2Vhc29uXHJcbiAgICBvciBwb3N0c2Vhc29uIGdhbWVzLiBWYWxpZCB2YWx1ZXMgYXJlIFBSRSwgUkVHIGFuZCBQT1NULlxyXG5cclxuICAgIFRoZSB3ZWVrIHBhcmFtZXRlciBpcyByZWxhdGl2ZSB0byB0aGUgdmFsdWUgb2YgdGhlIGtpbmQgcGFyYW1ldGVyLCBhbmRcclxuICAgIG1heSBiZSBzZXQgdG8gYSBsaXN0IG9mIHdlZWsgbnVtYmVycy5cclxuXHJcbiAgICBJbiB0aGUgcmVndWxhciBzZWFzb24sIHRoZSB3ZWVrIHBhcmFtZXRlciBjb3JyZXNwb25kcyB0byB0aGUgbm9ybWFsXHJcbiAgICB3ZWVrIG51bWJlcnMgMSB0aHJvdWdoIDE3LiBTaW1pbGFybHkgaW4gdGhlIHByZXNlYXNvbiwgdmFsaWQgd2VlayBudW1iZXJzXHJcbiAgICBhcmUgMSB0aHJvdWdoIDQuIEluIHRoZSBwb3N0IHNlYXNvbiwgdGhlIHdlZWsgbnVtYmVyIGNvcnJlc3BvbmRzIHRvIHRoZVxyXG4gICAgbnVtZXJpY2FsIHJvdW5kIG9mIHRoZSBwbGF5b2Zmcy4gU28gdGhlIHdpbGQgY2FyZCByb3VuZCBpcyB3ZWVrIDEsXHJcbiAgICB0aGUgZGl2aXNpb25hbCByb3VuZCBpcyB3ZWVrIDIsIHRoZSBjb25mZXJlbmNlIHJvdW5kIGlzIHdlZWsgM1xyXG4gICAgYW5kIHRoZSBTdXBlciBCb3dsIGlzIHdlZWsgNC5cclxuXHJcbiAgICBUaGUgeWVhciBwYXJhbWV0ZXIgc3BlY2lmaWVzIHRoZSBzZWFzb24sIGFuZCBub3QgbmVjZXNzYXJpbHkgdGhlIGFjdHVhbFxyXG4gICAgeWVhciB0aGF0IGEgZ2FtZSB3YXMgcGxheWVkIGluLiBGb3IgZXhhbXBsZSwgYSBTdXBlciBCb3dsIHRha2luZyBwbGFjZVxyXG4gICAgaW4gdGhlIHllYXIgMjAxMSBhY3R1YWxseSBiZWxvbmdzIHRvIHRoZSAyMDEwIHNlYXNvbi4gQWxzbywgdGhlIHllYXJcclxuICAgIHBhcmFtZXRlciBtYXkgYmUgc2V0IHRvIGEgbGlzdCBvZiBzZWFzb25zIGp1c3QgbGlrZSB0aGUgd2VlayBwYXJhbWV0ZXIuXHJcbiAgICBOb3RlIHRoYXQgaWYgYSBnYW1lJ3MgSlNPTiBkYXRhIGlzIG5vdCBjYWNoZWQgdG8gZGlzaywgaXQgaXMgcmV0cmlldmVkXHJcbiAgICBmcm9tIHRoZSBORkwgd2ViIHNpdGUuIEEgZ2FtZSdzIEpTT04gZGF0YSBpcyAqb25seSogY2FjaGVkIHRvIGRpc2sgb25jZVxyXG4gICAgdGhlIGdhbWUgaXMgb3Zlciwgc28gYmUgY2FyZWZ1bCB3aXRoIHRoZSBudW1iZXIgb2YgdGltZXMgeW91IGNhbGwgdGhpc1xyXG4gICAgd2hpbGUgYSBnYW1lIGlzIGdvaW5nIG9uLiAoaS5lLiwgZG9uJ3QgcGlzcyBvZmYgTkZMLmNvbS4pXHJcblxyXG4gICAgSWYgc3RhcnRlZCBpcyBUcnVlLCB0aGVuIG9ubHkgZ2FtZXMgdGhhdCBoYXZlIGFscmVhZHkgc3RhcnRlZCAob3IgYXJlXHJcbiAgICBhYm91dCB0byBzdGFydCBpbiBsZXNzIHRoYW4gNSBtaW51dGVzKSB3aWxsIGJlIHJldHVybmVkLiBOb3RlIHRoYXQgdGhlXHJcbiAgICBzdGFydGVkIHBhcmFtZXRlciByZXF1aXJlcyBweXR6IHRvIGJlIGluc3RhbGxlZC4gVGhpcyBpcyB1c2VmdWwgd2hlblxyXG4gICAgeW91IG9ubHkgd2FudCB0byBjb2xsZWN0IHN0YXRzIGZyb20gZ2FtZXMgdGhhdCBoYXZlIEpTT04gZGF0YSBhdmFpbGFibGVcclxuICAgIChhcyBvcHBvc2VkIHRvIHdhaXRpbmcgZm9yIGEgNDA0IGVycm9yIGZyb20gTkZMLmNvbSkuXHJcbiAgICAqL1xyXG59XHJcbiIsImltcG9ydCBmcyBmcm9tICdmcy1leHRyYSc7XHJcbmltcG9ydCB7IG5mbEFwaUdhbWUsIG5mbEFwaUdhbWVSZXNwb25zZSB9IGZyb20gJy4uL3NjaGVtYXMvbmZsQXBpR2FtZSc7XHJcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi4vc2NoZW1hcy9QbGF5ZXInO1xyXG5pbXBvcnQgU2NoZWR1bGUgZnJvbSAnLi9TY2hlZHVsZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBqc29uQ2FjaGUge1xyXG4gICAgZm9sZGVycGF0aDogc3RyaW5nO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihmaWxlcGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5mb2xkZXJwYXRoID0gZmlsZXBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QWJzUGF0aCgpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gZ2V0IGxpc3Qgb2YgZ2FtZXNcclxuICAgIGdldFNjaGVkdWxlKCkge1xyXG4gICAgICAgIGNvbnN0IHNjaGVkdWxlUGF0aCA9IGAke3RoaXMuZm9sZGVycGF0aH0vc19tYXN0ZXIuanNvbmBcclxuICAgICAgICBjb25zdCBleGlzdHMgPSBmcy5wYXRoRXhpc3RzU3luYyhzY2hlZHVsZVBhdGgpO1xyXG4gICAgICAgIGlmIChleGlzdHMpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNjaGVkdWxlOiBTY2hlZHVsZVtdID0gZnMucmVhZEpTT05TeW5jKHNjaGVkdWxlUGF0aClcclxuICAgICAgICAgICAgICAgIHJldHVybiBzY2hlZHVsZTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBqc29uIHJlYWQgdW5zdWNjZXNzZnVsXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycilcclxuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHBhdGggb3IgZmlsZSBkb2VzIG5vdCBleGlzdCBhdCBhbGxcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3BhdGggZG9lcyBub3QgZXhpc3QnKVxyXG4gICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBzYXZlU2NoZWR1bGUoc2NoZWR1bGU6IFNjaGVkdWxlW10pIHtcclxuICAgICAgICBjb25zdCBzY2hlZHVsZVBhdGggPSBgJHt0aGlzLmZvbGRlcnBhdGh9L3NfbWFzdGVyLmpzb25gXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgZnMud3JpdGVKU09OKHNjaGVkdWxlUGF0aCwgc2NoZWR1bGUpXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKGVycilcclxuICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBnZXQgbGlzdCBvZiBwbGF5ZXJzXHJcbiAgICBnZXRQbGF5ZXJMaXN0KCkge1xyXG4gICAgICAgIGNvbnN0IHBsYXllclBhdGggPSBgJHt0aGlzLmZvbGRlcnBhdGh9L3BfbWFzdGVyLmpzb25gXHJcbiAgICAgICAgY29uc3QgZXhpc3RzID0gZnMucGF0aEV4aXN0c1N5bmMocGxheWVyUGF0aCk7XHJcbiAgICAgICAgaWYgKGV4aXN0cykge1xyXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJzID0gZnMucmVhZEpTT05TeW5jKHBsYXllclBhdGgpO1xyXG4gICAgICAgICAgICByZXR1cm4gcGxheWVyc1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7fVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBzYXZlIGxpc3Qgb2YgcGxheWVyc1xyXG4gICAgYXN5bmMgc2F2ZVBsYXllckxpc3QocGxheWVyczoge1trZXk6IHN0cmluZ106IFBsYXllcn0pIHtcclxuICAgICAgICBjb25zdCBwbGF5ZXJQYXRoID0gYCR7dGhpcy5mb2xkZXJwYXRofS9wX21hc3Rlci5qc29uYFxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGZzLndyaXRlSlNPTihwbGF5ZXJQYXRoLCBwbGF5ZXJzKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgdGhyb3cgZXJyXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHJldHJpZXZlIGEgZ2FtZSBmcm9tIHRoZSBjYWNoZVxyXG4gICAgYXN5bmMgZ2V0R2FtZShnYW1laWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdhbWUgPSBhd2FpdCBmcy5yZWFkSlNPTihgJHt0aGlzLmZvbGRlcnBhdGh9LyR7Z2FtZWlkfS5qc29uYClcclxuICAgICAgICAgICAgcmV0dXJuIGdhbWVcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc2F2ZSBhIGdhbWUgdG8gdGhlIGNhY2hlXHJcbiAgICBhc3luYyBzYXZlR2FtZShnYW1laWQ6IHN0cmluZywgZGF0YTogbmZsQXBpR2FtZSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGZzLm91dHB1dEpTT04oYCR7dGhpcy5mb2xkZXJwYXRofS8ke2dhbWVpZH0uanNvbmAsIGRhdGEpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xuaW1wb3J0IGNoZWVyaW8gZnJvbSBcImNoZWVyaW9cIjtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBHYW1lRGV0YWlscyBmcm9tIFwiLi4vc2NoZW1hcy9HYW1lRGV0YWlsc1wiO1xuLy8gaW1wb3J0IHsgU2NoZWR1bGUgfSBmcm9tIFwiLi4vc2NoZW1hcy9TY2hlZHVsZVwiO1xuXG5pbnRlcmZhY2UgZ2FtZVdlZWtBcmdzIHtcbiAgeWVhcjogbnVtYmVyO1xuICBzdHlwZTogc3RyaW5nO1xuICB3ZWVrOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2Ugc2NoZWR1bGVHYW1lIHtcbiAgZ2FtZWlkOiBzdHJpbmc7XG4gIC8vIGdzaXM6IHN0cmluZztcbiAgd2RheTogc3RyaW5nO1xuICB0aW1lOiBzdHJpbmc7XG4gIHllYXI6IG51bWJlcjtcbiAgbW9udGg6IG51bWJlcjtcbiAgZGF5OiBudW1iZXI7XG4gIGdhbWVUeXBlOiBzdHJpbmc7XG4gIHdlZWs6IG51bWJlcjtcbiAgLy8gbWVyaWRpZW06IG51bGwgfCBzdHJpbmc7XG4gIHF1YXJ0ZXI6IHN0cmluZztcbiAgaG9tZVNob3J0OiBzdHJpbmc7XG4gIGhvbWVOYW1lOiBzdHJpbmc7XG4gIGhvbWVTY29yZTogbnVtYmVyO1xuICBhd2F5U2hvcnQ6IHN0cmluZztcbiAgYXdheU5hbWU6IHN0cmluZztcbiAgYXdheVNjb3JlOiBudW1iZXI7XG59XG5cbmNvbnN0IG5mbEN1cnJlbnRTY2hlZHVsZSA9IFwiaHR0cDovL3d3dy5uZmwuY29tL2xpdmV1cGRhdGUvc2NvcmVzdHJpcC9zcy54bWxcIjtcbmNvbnN0IG5mbEN1cnJlbnRTY2hlZHVsZVBvc3RTZWFzb24gPVxuICBcImh0dHA6Ly93d3cubmZsLmNvbS9saXZldXBkYXRlL3Njb3Jlc3RyaXAvcG9zdHNlYXNvbi9zcy54bWxcIjtcbmNvbnN0IG5mbFJvc3RlclVybCA9IFwiaHR0cDovL3d3dy5uZmwuY29tL3RlYW1zL3Jvc3Rlcj90ZWFtPVwiO1xuY29uc3QgbmZsUHJvZmlsZVVybCA9IFwiaHR0cDovL3d3dy5uZmwuY29tL3BsYXllcnMvcHJvZmlsZT9pZD1cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTkZMQXBpIHtcbiAgc3RhdGljIGFzeW5jIHllYXJQaGFzZVdlZWsod2Vlaz86IGdhbWVXZWVrQXJncykge1xuICAgIGxldCBjdXJyZW50V2VlazogZ2FtZVdlZWtBcmdzO1xuICAgIGlmICghd2Vlaykge1xuICAgICAgY3VycmVudFdlZWsgPSBhd2FpdCBORkxBcGkuY3VycmVudFllYXJQaGFzZVdlZWsoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudFdlZWsgPSB3ZWVrO1xuICAgIH1cblxuICAgIGNvbnN0IG5mbFllYXIgPSBbXG4gICAgICBbXCJQUkVcIiwgMF0sXG4gICAgICBbXCJQUkVcIiwgMV0sXG4gICAgICBbXCJQUkVcIiwgMl0sXG4gICAgICBbXCJQUkVcIiwgM10sXG4gICAgICBbXCJQUkVcIiwgNF0sXG4gICAgICBbXCJQUkVcIiwgNV0sXG4gICAgICBbXCJSRUdcIiwgMV0sXG4gICAgICBbXCJSRUdcIiwgMl0sXG4gICAgICBbXCJSRUdcIiwgM10sXG4gICAgICBbXCJSRUdcIiwgNF0sXG4gICAgICBbXCJSRUdcIiwgNV0sXG4gICAgICBbXCJSRUdcIiwgNl0sXG4gICAgICBbXCJSRUdcIiwgN10sXG4gICAgICBbXCJSRUdcIiwgOF0sXG4gICAgICBbXCJSRUdcIiwgOV0sXG4gICAgICBbXCJSRUdcIiwgMTBdLFxuICAgICAgW1wiUkVHXCIsIDExXSxcbiAgICAgIFtcIlJFR1wiLCAxMl0sXG4gICAgICBbXCJSRUdcIiwgMTNdLFxuICAgICAgW1wiUkVHXCIsIDE0XSxcbiAgICAgIFtcIlJFR1wiLCAxNV0sXG4gICAgICBbXCJSRUdcIiwgMTZdLFxuICAgICAgW1wiUkVHXCIsIDE3XSxcbiAgICAgIFtcIlJFR1wiLCAxOF0sXG4gICAgICBbXCJQT1NUXCIsIDFdLFxuICAgICAgW1wiUE9TVFwiLCAyXSxcbiAgICAgIFtcIlBPU1RcIiwgM10sXG4gICAgICBbXCJQT1NUXCIsIDRdLFxuICAgICAgW1wiUE9TVFwiLCA1XVxuICAgIF07XG5cbiAgICBjb25zdCBzY2hlZHVsZVdlZWtzOiBnYW1lV2Vla0FyZ3NbXSA9IFtdO1xuXG4gICAgLy8gVGhlcmUgc2hvdWxkIGJlIGEgYmV0dGVyIHdheSB0byB3cml0ZSB0aGlzXG4gICAgLy8gMS4gZ2VuZXJhdGUgYWxsIHRoZSB3ZWVrcyB1cCB0byB0aGUgY3VycmVudCB5ZWFyXG4gICAgY29uc3QgbWFwV2Vla3MgPSBfLm1hcChcbiAgICAgIF8ucmFuZ2UoMjAwOSwgY3VycmVudFdlZWsueWVhciArIDEpLFxuICAgICAgLy8gMi4gZ2VuZXJhdGUgYmFzZWQgb24gdGhlIGxpc3Qgb2Ygc2Vhc29uIGdhbWVzXG4gICAgICB5ID0+XG4gICAgICAgIG5mbFllYXIubWFwKHcgPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB5ZWFyOiB5LFxuICAgICAgICAgICAgd2VlazogK3dbMV0sXG4gICAgICAgICAgICBzdHlwZTogd1swXS50b1N0cmluZygpXG4gICAgICAgICAgfTtcbiAgICAgICAgfSlcbiAgICApO1xuXG4gICAgLy8gMy4gZmxhdHRlbiB0aGUgYXJyYXlcbiAgICBjb25zdCBhbGxXZWVrcyA9IF8uZmxhdHRlbihtYXBXZWVrcyk7XG5cbiAgICAvLyA0LiBydW4gdGhyb3VnaCB0aGUgZ2VuZXJhdGVkIHdlZWtzIHVwIHRvIHRoZSBjdXJyZW50IHdlZWtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbFdlZWtzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzY2hlZHVsZVdlZWtzLnB1c2goYWxsV2Vla3NbaV0pO1xuXG4gICAgICAvLyBzdG9wIG9uY2UgaXQgaXMgYSBjdXJyZW50IHdlZWtcbiAgICAgIGlmIChcbiAgICAgICAgYWxsV2Vla3NbaV0ueWVhciA9PSBjdXJyZW50V2Vlay55ZWFyICYmXG4gICAgICAgIGFsbFdlZWtzW2ldLndlZWsgPT0gY3VycmVudFdlZWsud2VlayAmJlxuICAgICAgICBhbGxXZWVrc1tpXS5zdHlwZSA9PSBjdXJyZW50V2Vlay5zdHlwZVxuICAgICAgKSB7XG4gICAgICAgIGkgPSBhbGxXZWVrcy5sZW5ndGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIF8ucmV2ZXJzZShzY2hlZHVsZVdlZWtzKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRTY2hlZHVsZVVybCh5ZWFyOiBudW1iZXIsIHN0eXBlOiBzdHJpbmcsIHdlZWs6IG51bWJlcikge1xuICAgIC8vIFJldHVybnMgdGhlIE5GTC5jb20gWE1MIHNjaGVkdWxlIFVSTC5cbiAgICBjb25zdCBiYXNlVXJsID0gXCJodHRwczovL3d3dy5uZmwuY29tL2FqYXgvc2NvcmVzdHJpcD9cIjtcbiAgICBpZiAoc3R5cGUgPT0gXCJQT1NUXCIpIHtcbiAgICAgIHdlZWsgKz0gMTc7XG4gICAgICBpZiAod2VlayA9PSAyMSkge1xuICAgICAgICB3ZWVrICs9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBgJHtiYXNlVXJsfXNlYXNvbj0ke3llYXJ9JnNlYXNvblR5cGU9JHtzdHlwZX0md2Vlaz0ke3dlZWt9YDtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBnZXRXZWVrU2NoZWR1bGUocGFyYW1zOiBnYW1lV2Vla0FyZ3MpIHtcbiAgICBjb25zdCB1cmwgPSBORkxBcGkuZ2V0U2NoZWR1bGVVcmwocGFyYW1zLnllYXIsIHBhcmFtcy5zdHlwZSwgcGFyYW1zLndlZWspO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KHVybCk7XG4gICAgICBjb25zdCB4bWwgPSByZXNwb25zZS5kYXRhO1xuICAgICAgY29uc3QgJCA9IGNoZWVyaW8ubG9hZCh4bWwpO1xuICAgICAgY29uc3QgZ2FtZXM6IHNjaGVkdWxlR2FtZVtdID0gW107XG4gICAgICAvLyBnYW1lIHNjaGVkdWxlIGlzIHJldHVybmVkIGZyb20gdGhlIHNjb3JlIHN0cmlwIGFzIHhtbFxuICAgICAgLy8gZWFjaCA8Zz4gcmVwcmVzZW50cyBhIGdhbWUuXG4gICAgICAkKFwiZ1wiKS5lYWNoKChpLCBlKSA9PiB7XG4gICAgICAgIGNvbnN0IGdpZCA9ICQoZSkuYXR0cihcImVpZFwiKTtcbiAgICAgICAgZ2FtZXNbaV0gPSB7XG4gICAgICAgICAgZ2FtZWlkOiBnaWQsXG4gICAgICAgICAgd2RheTogJChlKS5hdHRyKFwiZFwiKSxcbiAgICAgICAgICAvLyBnc2lzOiArJChlKS5hdHRyKFwiZ3Npc1wiKSxcbiAgICAgICAgICB5ZWFyOiBwYXJhbXMueWVhcixcbiAgICAgICAgICBtb250aDogK2dpZC5zbGljZSg0LCA2KSxcbiAgICAgICAgICBkYXk6ICtnaWQuc2xpY2UoNiwgOCksXG4gICAgICAgICAgdGltZTogJChlKS5hdHRyKFwidFwiKSxcbiAgICAgICAgICBxdWFydGVyOiAkKGUpLmF0dHIoXCJxXCIpLFxuICAgICAgICAgIGdhbWVUeXBlOiBwYXJhbXMuc3R5cGUsXG4gICAgICAgICAgd2VlazogcGFyYW1zLndlZWssXG4gICAgICAgICAgaG9tZVNob3J0OiAkKGUpLmF0dHIoXCJoXCIpLFxuICAgICAgICAgIGhvbWVOYW1lOiAkKGUpLmF0dHIoXCJobm5cIiksXG4gICAgICAgICAgaG9tZVNjb3JlOiArJChlKS5hdHRyKFwiaHNcIiksXG4gICAgICAgICAgYXdheVNob3J0OiAkKGUpLmF0dHIoXCJ2XCIpLFxuICAgICAgICAgIGF3YXlOYW1lOiAkKGUpLmF0dHIoXCJ2bm5cIiksXG4gICAgICAgICAgYXdheVNjb3JlOiArJChlKS5hdHRyKFwidnNcIilcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgICAgLy8gY29uc29sZS5sb2coZ2FtZXMpXG4gICAgICByZXR1cm4gZ2FtZXM7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFzeW5jIGN1cnJlbnRZZWFyUGhhc2VXZWVrKCkge1xuICAgIGNvbnN0IGN1cnJlbnRTY2hlZHVsZSA9IGF3YWl0IGF4aW9zLmdldChuZmxDdXJyZW50U2NoZWR1bGUpO1xuICAgIGNvbnN0ICQgPSBjaGVlcmlvLmxvYWQoY3VycmVudFNjaGVkdWxlLmRhdGEpO1xuICAgIGNvbnN0IHdlZWs6IGdhbWVXZWVrQXJncyA9IHtcbiAgICAgIHdlZWs6ICskKFwiZ21zXCIpLmF0dHIoXCJ3XCIpLFxuICAgICAgeWVhcjogKyQoXCJnbXNcIikuYXR0cihcInlcIiksXG4gICAgICBzdHlwZTogXCJSRUdcIlxuICAgIH07XG4gICAgY29uc3QgcCA9ICQoXCJnbXNcIikuYXR0cihcInRcIik7XG5cbiAgICBpZiAocCA9PSBcIlBcIikge1xuICAgICAgd2Vlay5zdHlwZSA9IFwiUFJFXCI7XG4gICAgfSBlbHNlIGlmIChwID09IFwiUE9TVFwiIHx8IHAgPT0gXCJQUk9cIikge1xuICAgICAgd2Vlay5zdHlwZSA9IFwiUE9TVFwiO1xuICAgICAgd2Vlay53ZWVrIC09IDE3O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBwaGFzZSBpcyBSRUdcbiAgICB9XG5cbiAgICByZXR1cm4gd2VlaztcbiAgfVxuXG4gIC8vIGdldHMgdGhlIGdhbWUgZGV0YWlsIGRhdGEgZnJvbSBORkwncyBnYW1lY2VudGVyIGVuZHBvaW50XG4gIHN0YXRpYyBhc3luYyBnZXRHYW1lKGdhbWVpZDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHVybCA9IGBodHRwczovL3d3dy5uZmwuY29tL2xpdmV1cGRhdGUvZ2FtZS1jZW50ZXIvJHtnYW1laWR9LyR7Z2FtZWlkfV9ndGQuanNvbmA7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldCh1cmwpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGFbZ2FtZWlkXTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgcm9zdGVyUGFyc2VyKHJhd1Jvc3Rlcjogc3RyaW5nKSB7XG4gICAgY29uc3QgJCA9IGNoZWVyaW8ubG9hZChyYXdSb3N0ZXIpO1xuICAgIGNvbnN0IGV2ZW5zID0gJChcInRyW2NsYXNzPWV2ZW5dXCIpO1xuICAgIGNvbnN0IG9kZHMgPSAkKFwidHJbY2xhc3M9b2RkXVwiKTtcbiAgICBjb25zdCBwbGF5ZXJzOiBhbnlbXSA9IFtdO1xuICAgIC8vQHRzLWlnbm9yZVxuICAgIGNvbnN0IGFkZFBsYXllciA9IChpbmRleCwgZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgbWV0YSA9ICQoZWxlbWVudCkuY2hpbGRyZW4oKTtcbiAgICAgIGNvbnN0IHBsYXllcjogYW55ID0ge307XG4gICAgICBtZXRhLmVhY2goKGksIGUpID0+IHtcbiAgICAgICAgc3dpdGNoIChpKSB7XG4gICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgcGxheWVyLm51bWJlciA9ICQoZSkudGV4dCgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY29uc3QgbmFtZSA9ICQoZSkuY2hpbGRyZW4oKS5maXJzdCgpLnRleHQoKS50cmltKCk7XG4gICAgICAgICAgICBpZiAobmFtZS5pbmNsdWRlcyhcIixcIikpIHtcbiAgICAgICAgICAgICAgcGxheWVyLmxhc3ROYW1lID0gbmFtZS5zcGxpdChcIixcIilbMF07XG4gICAgICAgICAgICAgIHBsYXllci5maXJzdE5hbWUgPSBuYW1lLnNwbGl0KFwiLFwiKVsxXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBsYXllci5sYXN0TmFtZSA9IG5hbWU7XG4gICAgICAgICAgICAgIHBsYXllci5maXJzdE5hbWUgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGxheWVyLnByb2ZpbGVVcmwgPSAkKGUpLmNoaWxkcmVuKCkuZmlyc3QoKS5hdHRyKFwiaHJlZlwiKTtcbiAgICAgICAgICAgIHBsYXllci5wbGF5ZXJpZCA9IHByb2ZpbGVJZEZyb21VcmwocGxheWVyLnByb2ZpbGVVcmwpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgcGxheWVyLnBvc2l0aW9uID0gJChlKS50ZXh0KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBwbGF5ZXIuc3RhdHVzID0gJChlKS50ZXh0KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICBwbGF5ZXIuaGVpZ2h0ID0gJChlKS50ZXh0KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICBwbGF5ZXIud2VpZ2h0ID0gJChlKS50ZXh0KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICBwbGF5ZXIuYmlydGhkYXRlID0gJChlKS50ZXh0KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICBwbGF5ZXIueWV4cCA9ICQoZSkudGV4dCgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgcGxheWVyLmNvbGxlZ2UgPSAkKGUpLnRleHQoKTtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgfTtcblxuICAgIGV2ZW5zLmVhY2goYWRkUGxheWVyKTtcbiAgICBvZGRzLmVhY2goYWRkUGxheWVyKTtcbiAgICByZXR1cm4gcGxheWVycztcbiAgICAvLyByZXR1cm4gXy5jb25jYXQoZXZlbnMsIG9kZHMpO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGdldFJvc3Rlcih0ZWFtOiBzdHJpbmcpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdXJsID0gbmZsUm9zdGVyVXJsICsgdGVhbTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KHVybCk7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZ2V0UGxheWVyUHJvZmlsZShnc2lzSWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KFxuICAgICAgYGh0dHBzOi8vd3d3Lm5mbC5jb20vcGxheWVycy9wcm9maWxlP2lkPSR7Z3Npc0lkfWBcbiAgICApO1xuICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICB9XG59XG5cbmZ1bmN0aW9uIHByb2ZpbGVJZEZyb21VcmwodXJsOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHVybC5tYXRjaCgvKFswLTldKykvKSFbMF07XG59XG4iLCJpbXBvcnQgY2hlZXJpbyBmcm9tICdjaGVlcmlvJztcclxuaW1wb3J0IFBsYXllciBmcm9tICcuLi9zY2hlbWFzL1BsYXllcic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VQcm9maWxlKGh0bWw6IHN0cmluZyk6IFBsYXllciB7XHJcbiAgICBjb25zdCAkID0gY2hlZXJpby5sb2FkKGh0bWwpO1xyXG4gICAgLy8gbnVtYmVyIGFuZCBwb3N0aWlvbiBvbmx5IGF2YWlsYWJsZSB0byBhY3RpdmUgcGxheWVyc1xyXG4gICAgY29uc3QgbnVtYmVyU3RyaXAgPSAkKCdzcGFuLnBsYXllci1udW1iZXInKS50ZXh0KClcclxuICAgIC8vIGNvbnN0IHBsYXllckluZm8gPSAkKCdkaXYucGxheWVyLWluZm8nKS5jaGlsZHJlbigpXHJcbiAgICBjb25zdCBuYW1lU3RyaXAgPSAkKCcjcGxheWVyTmFtZScpLmF0dHIoJ2NvbnRlbnQnKTtcclxuICAgIGNvbnN0IHBsYXllcklkID0gJCgnI3BsYXllcklkJykuYXR0cignY29udGVudCcpO1xyXG4gICAgbGV0IHRlYW0gPSAkKCcjcGxheWVyVGVhbScpLmF0dHIoJ2NvbnRlbnQnKTtcclxuICAgIGNvbnN0IHVybCA9ICQoJ2xpbmtbcmVsPWNhbm9uaWNhbF0nKS5hdHRyKCdocmVmJylcclxuICAgIC8vIGNvbnN0IHBoeXNpY2FsUm93ID0gcGxheWVySW5mby5maWx0ZXIoKGksIGUpID0+IGkgPT0gMik7XHJcbiAgICAvLyByZWdleCBzZWVtcyB0byBiZSB0aGUgZWFzaWVzdCB3YXkgdG8gZ2V0IGF0IHRoZXNlIHNwZWNpZmljIHBpZWNlcyBvZiBkYXRhLlxyXG4gICAgY29uc3QgZ3Npc0lkID0gaHRtbC5tYXRjaCgvKD86R1NJUyBJRDogKVxcVyooXFxkK1xcVytcXGQrKS8pIVsxXVxyXG4gICAgY29uc3QgaGVpZ2h0U3RyaXAgPSBodG1sLm1hdGNoKC8oPzo8c3Ryb25nPikoPzpIZWlnaHQpKD86PFxcL3N0cm9uZz4pXFxXXFxzKFxcZCtcXFdcXGQrKS8pIVsxXVxyXG4gICAgY29uc3Qgd2VpZ2h0U3RyaXAgPSBodG1sLm1hdGNoKC8oPzo8c3Ryb25nPikoPzpXZWlnaHQpKD86PFxcL3N0cm9uZz4pXFxXXFxzKFxcZCspLykhWzFdXHJcbiAgICBjb25zdCBhZ2VTdHJpcCA9IGh0bWwubWF0Y2goLyg/OjxzdHJvbmc+KSg/OkFnZSkoPzo8XFwvc3Ryb25nPilcXFdcXHMoXFxkKykvKSFbMV1cclxuICAgIGNvbnN0IGJpcnRoU3RyaXAgPSBodG1sLm1hdGNoKC8oPzo8c3Ryb25nPikoPzpCb3JuKSg/OjxcXC9zdHJvbmc+KVxcVytcXHMrKFxcZHsxLDJ9XFwvXFxkezEsMn1cXC9cXGR7NH0pXFxzKyhcXGJbYS16QS1aXFxzXSssWyBdP1tBLVpdezJ9XFxiKS8pXHJcbiAgICBjb25zdCBjb2xsZWdlU3RyaXAgPSBodG1sLm1hdGNoKC8oPzo8c3Ryb25nPikoPzpDb2xsZWdlKSg/OjxcXC9zdHJvbmc+KVxcV1xccysoW1xcdy1cXHNdKykvKVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKG51bWJlclN0cmlwKTtcclxuICAgIGxldCBudW1iZXIgPSAwXHJcbiAgICBsZXQgcG9zaXRpb24gPSAnJ1xyXG5cclxuICAgIC8vIFRPRE86IGEgbG90IG9mIHJlZHVuZGFuY3kgaGVyZS5cclxuICAgIGNvbnN0IGZpcnN0TmFtZSA9IG5hbWVTdHJpcC5zcGxpdCgnICcpWzBdLnRyaW0oKVxyXG4gICAgY29uc3QgbGFzdE5hbWUgPSBuYW1lU3RyaXAuc3BsaXQoJyAnKVsxXS50cmltKClcclxuICAgIGNvbnN0IGZ1bGxOYW1lID0gYCR7Zmlyc3ROYW1lfSAke2xhc3ROYW1lfWBcclxuXHJcbiAgICBsZXQgYmlydGhEYXRlID0gJyc7XHJcbiAgICBsZXQgYmlydGhDaXR5ID0gJyc7XHJcbiAgICBpZiAoYmlydGhTdHJpcCAhPSBudWxsKSB7XHJcbiAgICAgICAgYmlydGhEYXRlID0gYmlydGhTdHJpcCFbMV1cclxuICAgICAgICBiaXJ0aENpdHkgPSBiaXJ0aFN0cmlwIVsyXVxyXG4gICAgfVxyXG4gICAgY29uc3Qgd2VpZ2h0ID0gK3dlaWdodFN0cmlwXHJcbiAgICBjb25zdCBjb2xsZWdlID0gY29sbGVnZVN0cmlwIVsxXVxyXG4gICAgY29uc3QgYWdlID0gK2FnZVN0cmlwXHJcbiAgICBjb25zdCBoZWlnaHQgPSBmZWV0SW5jaGVzVG9JbmNoZXMoaGVpZ2h0U3RyaXApXHJcblxyXG4gICAgaWYgKG51bWJlclN0cmlwID09IG51bGwpIHtcclxuICAgICAgICB0ZWFtID0gJydcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbnVtYmVyUHJlc2VudCA9IG51bWJlclN0cmlwLm1hdGNoKC8oXFxkKykvKVxyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uUHJlc2VudCA9IG51bWJlclN0cmlwLm1hdGNoKC8oW0EtWl0rKS8pXHJcbiAgICAgICAgaWYgKG51bWJlclByZXNlbnQgIT0gbnVsbCAmJiBwb3NpdGlvblByZXNlbnQgIT0gbnVsbCApIHtcclxuICAgICAgICAgICAgbnVtYmVyID0gK251bWJlclN0cmlwLm1hdGNoKC8oXFxkKykvKSFbMF1cclxuICAgICAgICAgICAgcG9zaXRpb24gPSBudW1iZXJTdHJpcC5tYXRjaCgvKFtBLVpdKykvKSFbMF1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBmdWxsTmFtZSxcclxuICAgICAgICBwbGF5ZXJJZCxcclxuICAgICAgICB0ZWFtLFxyXG4gICAgICAgIGZpcnN0TmFtZSxcclxuICAgICAgICBnc2lzSWQsXHJcbiAgICAgICAgbGFzdE5hbWUsXHJcbiAgICAgICAgYmlydGhDaXR5LFxyXG4gICAgICAgIGJpcnRoRGF0ZSxcclxuICAgICAgICBjb2xsZWdlLFxyXG4gICAgICAgIGFnZSxcclxuICAgICAgICBwcm9maWxlVXJsOiB1cmwsXHJcbiAgICAgICAgcHJvZmlsZUlkOiBwcm9maWxlSWRGcm9tVXJsKHVybCksXHJcbiAgICAgICAgbnVtYmVyLFxyXG4gICAgICAgIHBvc2l0aW9uLFxyXG4gICAgICAgIHdlaWdodCxcclxuICAgICAgICBoZWlnaHRcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcHJvZmlsZUlkRnJvbVVybCh1cmw6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIHVybC5tYXRjaCgvKFswLTldKykvKSFbMF07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZlZXRJbmNoZXNUb0luY2hlcyhoZWlnaHQ6IHN0cmluZykge1xyXG4gICAgY29uc3QgW2ZlZXQsIGluY2hlc10gPSBoZWlnaHQuc3BsaXQoJy0nKVxyXG4gICAgcmV0dXJuIDEyICogK2ZlZXQgKyAraW5jaGVzXHJcbn0iLCJpbXBvcnQganNvbkNhY2hlIGZyb20gXCIuL2pzb25DYWNoZVwiO1xyXG5pbXBvcnQgUGxheWVyIGZyb20gXCIuLi9zY2hlbWFzL1BsYXllclwiO1xyXG5pbXBvcnQgTkZMQXBpLCB7IHNjaGVkdWxlR2FtZSB9IGZyb20gXCIuL25mbEFwaVwiO1xyXG4vLyBpbXBvcnQgeyBzZWFyY2hTY2hlZHVsZUFyZ3MsIFNjaGVkdWxlIH0gZnJvbSBcIi4uL3NjaGVtYXMvU2NoZWR1bGVcIjtcclxuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xyXG5pbXBvcnQgeyBuZmxBcGlHYW1lLCBuZmxBcGlHYW1lUmVzcG9uc2UgfSBmcm9tIFwiLi4vc2NoZW1hcy9uZmxBcGlHYW1lXCI7XHJcbmltcG9ydCB7IHBhcnNlUHJvZmlsZSB9IGZyb20gXCIuL25mbFBsYXllclwiO1xyXG5pbXBvcnQgeyBnZXRQbGF5ZXJTdGF0cyB9IGZyb20gXCIuL0dhbWVcIjtcclxuaW1wb3J0IHsgZ2FtZVNlYXJjaEFyZ3MsIEdhbWUgfSBmcm9tIFwiLi4vc2NoZW1hcy9HYW1lXCI7XHJcblxyXG5mdW5jdGlvbiB0cmFuc3Bvc2VBcmdzKGFyZ3M6IGdhbWVTZWFyY2hBcmdzKSB7XHJcbiAgY29uc3QgcGFyYW1zOiBhbnkgPSB7XHJcbiAgICBob21lU2hvcnQ6IGFyZ3MuaG9tZSxcclxuICAgIGF3YXlTaG9ydDogYXJncy5hd2F5LFxyXG4gICAgZ2FtZVR5cGU6IGFyZ3Muc2Vhc29uVHlwZSxcclxuICAgIHdlZWs6IGFyZ3Mud2VlayxcclxuICAgIHllYXI6IGFyZ3MueWVhclxyXG4gIH07XHJcbiAgcmV0dXJuIF8ub21pdEJ5KHBhcmFtcywgXy5pc1VuZGVmaW5lZCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIG5mbEdhbWUge1xyXG4gIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBuZmxHYW1lO1xyXG4gIHByaXZhdGUgc3RhdGljIGZpbGVQYXRoOiBzdHJpbmc7XHJcbiAgY2FjaGU6IGpzb25DYWNoZTtcclxuICBuZmxBcGk6IE5GTEFwaTtcclxuICBzY2hlZHVsZTogc2NoZWR1bGVHYW1lW107XHJcbiAgcGxheWVyczoge1xyXG4gICAgW2tleTogc3RyaW5nXTogUGxheWVyO1xyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgY29uc3RydWN0b3IoZmlsZVBhdGg6IHN0cmluZykge1xyXG4gICAgbmZsR2FtZS5maWxlUGF0aCA9IGZpbGVQYXRoO1xyXG4gICAgdGhpcy5jYWNoZSA9IG5ldyBqc29uQ2FjaGUoZmlsZVBhdGgpO1xyXG4gICAgLy9AdHMtaWdub3JlXHJcbiAgICB0aGlzLnNjaGVkdWxlID0gdGhpcy5jYWNoZS5nZXRTY2hlZHVsZSgpO1xyXG4gICAgdGhpcy5wbGF5ZXJzID0gdGhpcy5jYWNoZS5nZXRQbGF5ZXJMaXN0KCk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0SW5zdGFuY2UoZmlsZVBhdGg/OiBzdHJpbmcpIHtcclxuICAgIGlmICghbmZsR2FtZS5pbnN0YW5jZSAmJiBmaWxlUGF0aCkge1xyXG4gICAgICBuZmxHYW1lLmluc3RhbmNlID0gbmV3IG5mbEdhbWUoZmlsZVBhdGgpO1xyXG4gICAgICByZXR1cm4gbmZsR2FtZS5pbnN0YW5jZTtcclxuICAgIH0gZWxzZSBpZiAoZmlsZVBhdGggIT0gbmZsR2FtZS5maWxlUGF0aCAmJiBmaWxlUGF0aCkge1xyXG4gICAgICBuZmxHYW1lLmluc3RhbmNlID0gbmV3IG5mbEdhbWUoZmlsZVBhdGgpO1xyXG4gICAgICByZXR1cm4gbmZsR2FtZS5pbnN0YW5jZTtcclxuICAgIH0gZWxzZSBpZiAoIW5mbEdhbWUuaW5zdGFuY2UgJiYgIWZpbGVQYXRoKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImZpbGVwYXRoIGlzIG5vdCBzZXQsIGNhbm5vdCByZXRyaWV2ZSBjYWNoZVwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBuZmxHYW1lLmluc3RhbmNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgcmVnZW5lcmF0ZVNjaGVkdWxlKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZ2FtZXNUaWxsTm93ID0gYXdhaXQgTkZMQXBpLnllYXJQaGFzZVdlZWsoKTtcclxuICAgICAgY29uc3QgZ2FtZXMgPSBhd2FpdCBQcm9taXNlLmFsbChnYW1lc1RpbGxOb3cubWFwKE5GTEFwaS5nZXRXZWVrU2NoZWR1bGUpKTtcclxuICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgIGNvbnN0IHNhdmUgPSBhd2FpdCB0aGlzLmNhY2hlLnNhdmVTY2hlZHVsZShfLmZsYXR0ZW4oZ2FtZXMpKTtcclxuICAgICAgcmV0dXJuIHNhdmU7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgdGhyb3cgZXJyO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbW91bnRHYW1lRGV0YWlscyA9IGFzeW5jIChzY2hlZHVsZUdhbWU6IHNjaGVkdWxlR2FtZSkgPT4ge1xyXG4gICAgY29uc3QgZ2FtZURldGFpbHMgPSBhd2FpdCB0aGlzLmdldEdhbWUoc2NoZWR1bGVHYW1lLmdhbWVpZCk7XHJcbiAgICBjb25zdCBnYW1lOiBHYW1lID0ge1xyXG4gICAgICBnYW1laWQ6IHNjaGVkdWxlR2FtZS5nYW1laWQsXHJcbiAgICAgIHdkYXk6IHNjaGVkdWxlR2FtZS53ZGF5LFxyXG4gICAgICBtb250aDogc2NoZWR1bGVHYW1lLm1vbnRoLFxyXG4gICAgICBxdWFydGVyOiBzY2hlZHVsZUdhbWUucXVhcnRlcixcclxuICAgICAgZGF5OiBzY2hlZHVsZUdhbWUuZGF5LFxyXG4gICAgICBnYW1lVHlwZTogc2NoZWR1bGVHYW1lLmdhbWVUeXBlLFxyXG4gICAgICBob21lU2hvcnQ6IHNjaGVkdWxlR2FtZS5ob21lU2hvcnQsXHJcbiAgICAgIGhvbWVOYW1lOiBzY2hlZHVsZUdhbWUuaG9tZU5hbWUsXHJcbiAgICAgIGhvbWVTY29yZTogZ2FtZURldGFpbHMuaG9tZS5zY29yZS5ULFxyXG4gICAgICBhd2F5U2hvcnQ6IHNjaGVkdWxlR2FtZS5hd2F5U2hvcnQsXHJcbiAgICAgIGF3YXlOYW1lOiBzY2hlZHVsZUdhbWUuYXdheU5hbWUsXHJcbiAgICAgIGF3YXlTY29yZTogZ2FtZURldGFpbHMuYXdheS5zY29yZS5ULFxyXG4gICAgICByZWR6b25lOiBnYW1lRGV0YWlscy5yZWR6b25lLFxyXG4gICAgICB5bDogZ2FtZURldGFpbHMueWwsXHJcbiAgICAgIG1lZGlhOiBnYW1lRGV0YWlscy5tZWRpYSA/IGdhbWVEZXRhaWxzLm1lZGlhIDogXCJcIixcclxuICAgICAgY2xvY2s6IGdhbWVEZXRhaWxzLmNsb2NrLFxyXG4gICAgICB3ZWF0aGVyOiBnYW1lRGV0YWlscy53ZWF0aGVyID8gZ2FtZURldGFpbHMud2VhdGhlciA6IFwiXCIsXHJcbiAgICAgIGhvbWVTY29yZV9xMTogZ2FtZURldGFpbHMuaG9tZS5zY29yZVtcIjFcIl0sXHJcbiAgICAgIGhvbWVTY29yZV9xMjogZ2FtZURldGFpbHMuaG9tZS5zY29yZVtcIjJcIl0sXHJcbiAgICAgIGhvbWVTY29yZV9xMzogZ2FtZURldGFpbHMuaG9tZS5zY29yZVtcIjNcIl0sXHJcbiAgICAgIGhvbWVTY29yZV9xNDogZ2FtZURldGFpbHMuaG9tZS5zY29yZVtcIjRcIl0sXHJcbiAgICAgIGF3YXlTY29yZV9xMTogZ2FtZURldGFpbHMuYXdheS5zY29yZVtcIjFcIl0sXHJcbiAgICAgIGF3YXlTY29yZV9xMjogZ2FtZURldGFpbHMuYXdheS5zY29yZVtcIjJcIl0sXHJcbiAgICAgIGF3YXlTY29yZV9xMzogZ2FtZURldGFpbHMuYXdheS5zY29yZVtcIjNcIl0sXHJcbiAgICAgIGF3YXlTY29yZV9xNDogZ2FtZURldGFpbHMuYXdheS5zY29yZVtcIjRcIl1cclxuICAgIH07XHJcbiAgICByZXR1cm4gZ2FtZTtcclxuICB9O1xyXG5cclxuICBhc3luYyBzZWFyY2hTY2hlZHVsZShhcmdzOiBnYW1lU2VhcmNoQXJncykge1xyXG4gICAgLy8gY29uc29sZS5sb2codHJhbnNwb3NlQXJncyhhcmdzKSk7XHJcbiAgICBsZXQgZ2FtZXM6IHNjaGVkdWxlR2FtZVtdID0gW107XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAodGhpcy5zY2hlZHVsZS5sZW5ndGggPCAxKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5yZWdlbmVyYXRlU2NoZWR1bGUoKTtcclxuICAgICAgICAvLyBUT0RPOiBmaWd1cmUgb3V0IHdoeSB0aGlzIGlzIHByb2R1Y2luZyBhIHR5cGUgZXJyb3JcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBnYW1lcyA9IF8uZmlsdGVyKHRoaXMuc2NoZWR1bGUsIHRyYW5zcG9zZUFyZ3MoYXJncykpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIGdhbWVzID0gXy5maWx0ZXIodGhpcy5zY2hlZHVsZSwgdHJhbnNwb3NlQXJncyhhcmdzKSk7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgbW91bnRlZEdhbWVzID0gYXdhaXQgZ2FtZXMubWFwKHRoaXMubW91bnRHYW1lRGV0YWlscyk7XHJcbiAgICAgIHJldHVybiBtb3VudGVkR2FtZXM7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgdGhyb3cgZXJyO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0U2luZ2xlR2FtZShnYW1laWQ6IHN0cmluZykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZ2FtZSA9IF8uZmluZCh0aGlzLnNjaGVkdWxlLCB7IGdhbWVpZDogZ2FtZWlkIH0pO1xyXG4gICAgICBpZiAoZ2FtZSkge1xyXG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLm1vdW50R2FtZURldGFpbHMoZ2FtZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICB0aHJvdyBlcnI7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRHYW1lKGdhbWVpZDogc3RyaW5nKTogUHJvbWlzZTxuZmxBcGlHYW1lPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBuZmxHYW1lID0gYXdhaXQgdGhpcy5nZXRHYW1lY2VudGVyR2FtZShnYW1laWQpO1xyXG4gICAgICByZXR1cm4gbmZsR2FtZTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIC8vIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGdldEdhbWVjZW50ZXJHYW1lKGdhbWVpZD86IHN0cmluZykge1xyXG4gICAgaWYgKCFnYW1laWQpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm8gZ2FtZWlkIHBhc3NlZFwiKTtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGNhY2hlR2FtZSA9IGF3YWl0IHRoaXMuY2FjaGUuZ2V0R2FtZShnYW1laWQpO1xyXG4gICAgICAvLyBpZiAoIWNhY2hlR2FtZSkge1xyXG4gICAgICAvLyBpZiBjYWNoZWQgZ2FtZSBpcyBub3QgZm91bmQsXHJcbiAgICAgIC8vIHdlIGZldGNoIHRoZSBnYW1lIGZyb20gTkZMLmNvbVxyXG4gICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAvLyBpZiB0aGUgZ2FtZSBpcyBmb3VuZCBpbiBjYWNoZSB0aGF0IGlzIHJldHVybmVkIGluc3RlYWQuXHJcbiAgICAgIGNvbnNvbGUubG9nKFwiZ2FtZSBmb3VuZCBpbiBjYWNoZVwiKTtcclxuICAgICAgY2FjaGVHYW1lLmdhbWVpZCA9IGdhbWVpZDtcclxuICAgICAgcmV0dXJuIGNhY2hlR2FtZTtcclxuICAgICAgLy8gfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiZ2FtZSBpcyBub3QgZm91bmQgaW4gY2FjaGUsIHB1bGxpbmcgZnJvbSBuZmwuY29tXCIpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGdhbWVSZXNwb25zZSA9IGF3YWl0IHRoaXMuZmV0Y2hHYW1lKGdhbWVpZCk7XHJcbiAgICAgICAgLy8gYW5kIHNhdmUgaXQgdG8gY2FjaGVcclxuICAgICAgICBhd2FpdCB0aGlzLmNhY2hlLnNhdmVHYW1lKGdhbWVpZCwgZ2FtZVJlc3BvbnNlKTtcclxuICAgICAgICAvLyBiZWZvcmUgcmV0dXJuaW5nIGl0IHRvIHRoZSB1c2VyXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGdhbWVSZXNwb25zZS5nYW1laWQgPSBnYW1laWQ7XHJcbiAgICAgICAgcmV0dXJuIGdhbWVSZXNwb25zZTtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0QWdnR2FtZVN0YXRzKGdhbWVpZDogc3RyaW5nKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBnYW1lID0gYXdhaXQgdGhpcy5nZXRHYW1lY2VudGVyR2FtZShnYW1laWQpO1xyXG4gICAgICByZXR1cm4gZ2V0UGxheWVyU3RhdHMoZ2FtZSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBmZXRjaEdhbWUoZ2FtZWlkOiBzdHJpbmcpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGdhbWU6IG5mbEFwaUdhbWUgPSBhd2FpdCBORkxBcGkuZ2V0R2FtZShnYW1laWQpO1xyXG4gICAgICByZXR1cm4gZ2FtZTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgZmV0Y2hQbGF5ZXIoZ3Npc0lkOiBzdHJpbmcpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGh0bWwgPSBhd2FpdCBORkxBcGkuZ2V0UGxheWVyUHJvZmlsZShnc2lzSWQpO1xyXG4gICAgICBjb25zdCBwbGF5ZXIgPSBwYXJzZVByb2ZpbGUoaHRtbCk7XHJcbiAgICAgIHRoaXMucGxheWVyc1tnc2lzSWRdID0gcGxheWVyO1xyXG4gICAgICBhd2FpdCB0aGlzLmNhY2hlLnNhdmVQbGF5ZXJMaXN0KHRoaXMucGxheWVycyk7XHJcbiAgICAgIHJldHVybiBwbGF5ZXI7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRQbGF5ZXIoZ3Npc0lkOiBzdHJpbmcpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IG1hdGNoID0gXy5maWx0ZXIodGhpcy5wbGF5ZXJzLCB7IGdzaXNJZDogZ3Npc0lkIH0pO1xyXG4gICAgICBpZiAobWF0Y2gubGVuZ3RoIDwgMSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicGxheWVyIG5vdCBmb3VuZC4uLiBmZXRjaGluZ1wiKTtcclxuICAgICAgICBjb25zdCBwbGF5ZXIgPSBhd2FpdCB0aGlzLmZldGNoUGxheWVyKGdzaXNJZCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYGFkZGVkICR7cGxheWVyLmZ1bGxOYW1lfWApO1xyXG4gICAgICAgIHJldHVybiBwbGF5ZXI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwbGF5ZXIgZm91bmRcIik7XHJcbiAgICAgICAgcmV0dXJuIG1hdGNoWzBdO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICByZXR1cm4ge307XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyAgIGFzeW5jIGdldEdhbWVzQnlTY2hlZHVsZShwYXJhbXM6IHNlYXJjaFNjaGVkdWxlQXJncykge1xyXG4gIC8vICAgICBjb25zdCBtYXRjaCA9IHBhcmFtcztcclxuICAvLyAgICAgLy8gY29uc29sZS5sb2cobWF0Y2gpXHJcbiAgLy8gICAgIHJldHVybiBfLmZpbHRlcih0aGlzLnNjaGVkdWxlLCBtYXRjaCk7XHJcbiAgLy8gICB9XHJcbn1cclxuIiwiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcclxuaW1wb3J0IHsgUmVzb2x2ZXIsIFF1ZXJ5LCBBcmdzLCBGaWVsZFJlc29sdmVyLCBSb290IH0gZnJvbSBcInR5cGUtZ3JhcGhxbFwiO1xyXG5pbXBvcnQgeyBBZ2dHYW1lU3RhdCwgQWdnR2FtZVN0YXRBcmdzIH0gZnJvbSBcIi4uL3NjaGVtYXMvQWdnR2FtZVN0YXRcIjtcclxuaW1wb3J0IG5mbEdhbWUgZnJvbSBcIi4uL25mbGdhbWUvbmZsZ2FtZVwiO1xyXG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XHJcblxyXG5AUmVzb2x2ZXIob2YgPT4gQWdnR2FtZVN0YXQpXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFnZ0dhbWVTdGF0UmVzb2x2ZXIge1xyXG4gICAgQFF1ZXJ5KHJldHVybnMgPT4gW0FnZ0dhbWVTdGF0XSlcclxuICAgIGFzeW5jIGdldEdhbWVTdGF0c0J5R2FtZUlkKFxyXG4gICAgICAgIEBBcmdzKCkgcGFyYW1zOiBBZ2dHYW1lU3RhdEFyZ3NcclxuICAgICkge1xyXG4gICAgICAgIGlmKCFwYXJhbXMuaWQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGlkIHBhc3NlZCcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCBzdGF0cyA9IGF3YWl0IG5mbEdhbWUuZ2V0SW5zdGFuY2UoKS5nZXRBZ2dHYW1lU3RhdHMocGFyYW1zLmlkKTtcclxuICAgICAgICAgICAgLy8gaWYgKG5hbWUgfHwgY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgLy8gICAgIGNvbnN0IGZpbHRlciA9IHt9XHJcbiAgICAgICAgICAgIC8vICAgICBpZihuYW1lKXtcclxuICAgICAgICAgICAgLy8gICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgLy8gICAgICAgICBmaWx0ZXIubmFtZSA9IG5hbWVcclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gICAgIGlmKGNhdGVnb3J5KXtcclxuICAgICAgICAgICAgLy8gICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgLy8gICAgICAgICBmaWx0ZXIuY2F0ZWdvcnkgPSBjYXRlZ29yeVxyXG4gICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgc3RhdHMgPSBfLmZpbHRlcihzdGF0cywgZmlsdGVyKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdHNcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBARmllbGRSZXNvbHZlcigpXHJcbiAgICBhc3luYyBwbGF5ZXIoQFJvb3QoKSBzdGF0OiBBZ2dHYW1lU3RhdCkge1xyXG4gICAgICAgIHJldHVybiBhd2FpdCBuZmxHYW1lLmdldEluc3RhbmNlKCkuZ2V0UGxheWVyKHN0YXQucGxheWVySWQpXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgXCJyZWZsZWN0LW1ldGFkYXRhXCI7XHJcbmltcG9ydCB7IEFyZywgQXJncywgUXVlcnksIFJlc29sdmVyLCBGaWVsZFJlc29sdmVyLCBSb290IH0gZnJvbSBcInR5cGUtZ3JhcGhxbFwiO1xyXG5cclxuaW1wb3J0IHsgZ2FtZVNlYXJjaEFyZ3MsIEdhbWUsIHNjb3JlRGV0YWlscyB9IGZyb20gXCIuLi9zY2hlbWFzL0dhbWVcIjtcclxuXHJcbmltcG9ydCBuZmxHYW1lIGZyb20gXCIuLi9uZmxnYW1lL25mbGdhbWVcIjtcclxuXHJcbkBSZXNvbHZlcihvZiA9PiBHYW1lKVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lUmVzb2x2ZXIge1xyXG4gIEBRdWVyeShyZXR1cm5zID0+IFtHYW1lXSwgeyBudWxsYWJsZTogdHJ1ZSB9KVxyXG4gIGFzeW5jIGdhbWVzKEBBcmdzKCkgaW5wdXQ6IGdhbWVTZWFyY2hBcmdzKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBzY2hlZHVsZSA9IGF3YWl0IG5mbEdhbWUuZ2V0SW5zdGFuY2UoKS5zZWFyY2hTY2hlZHVsZShpbnB1dCk7XHJcbiAgICAgIHJldHVybiBzY2hlZHVsZTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHRocm93IGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQFF1ZXJ5KHJldHVybnMgPT4gR2FtZSwgeyBudWxsYWJsZTogdHJ1ZSB9KVxyXG4gIGFzeW5jIGdhbWUoQEFyZyhcImdhbWVpZFwiKSBnYW1laWQ6IHN0cmluZykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZ2FtZSA9IGF3YWl0IG5mbEdhbWUuZ2V0SW5zdGFuY2UoKS5nZXRTaW5nbGVHYW1lKGdhbWVpZCk7XHJcbiAgICAgIHJldHVybiBnYW1lO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIHRocm93IGVycjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBGaWVsZFJlc29sdmVyKClcclxuICBhc3luYyBhZ2dyZWdhdGVkR2FtZVN0YXRzKEBSb290KCkgZ2FtZTogR2FtZSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZ2FtZURldGFpbHMgPSBhd2FpdCBuZmxHYW1lXHJcbiAgICAgICAgLmdldEluc3RhbmNlKClcclxuICAgICAgICAuZ2V0QWdnR2FtZVN0YXRzKGdhbWUuZ2FtZWlkKTtcclxuICAgICAgcmV0dXJuIGdhbWVEZXRhaWxzO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFJlc29sdmVyLCBRdWVyeSwgQXJnLCBGaWVsZFJlc29sdmVyLCBSb290IH0gZnJvbSBcInR5cGUtZ3JhcGhxbFwiO1xyXG5pbXBvcnQgUGxheWVyIGZyb20gXCIuLi9zY2hlbWFzL1BsYXllclwiO1xyXG5pbXBvcnQgbmZsR2FtZSBmcm9tIFwiLi4vbmZsZ2FtZS9uZmxnYW1lXCI7XHJcbi8vIGltcG9ydCB7IGdldFBsYXllckJ5SWQgfSBmcm9tIFwiLi4vbmZsZ2FtZS9uZmxQbGF5ZXJcIjtcclxuXHJcbi8vIEBSZXNvbHZlcihvZiA9PiBHYW1lKVxyXG4vLyBleHBvcnQgZGVmYXVsdCBjbGFzcyB7XHJcbi8vICAgICBAUXVlcnkocmV0dXJucyA9PiBHYW1lLCB7IG51bGxhYmxlOiB0cnVlIH0pXHJcbi8vICAgICBhc3luYyBnYW1lQnlpZChAQXJnKFwiZWlkXCIpIGVpZDogbnVtYmVyKTogUHJvbWlzZTxhbnk+IHsgfVxyXG4vLyB9XHJcblxyXG5AUmVzb2x2ZXIob2YgPT4gUGxheWVyKVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XHJcbiAgQFF1ZXJ5KHJldHVybnMgPT4gUGxheWVyKVxyXG4gIGFzeW5jIFBsYXllcihAQXJnKFwiaWRcIikgaWQ6IHN0cmluZykge1xyXG4gICAgY29uc3QgcCA9IGF3YWl0IG5mbEdhbWUuZ2V0SW5zdGFuY2UoKS5nZXRQbGF5ZXIoaWQpO1xyXG4gICAgcmV0dXJuIHA7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IE9iamVjdFR5cGUsIEZpZWxkLCBJRCwgSW5wdXRUeXBlLCBBcmdzVHlwZSB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcclxuaW1wb3J0IFBsYXllciBmcm9tIFwiLi9QbGF5ZXJcIjtcclxuaW1wb3J0IHsgZnJvbU51bWJlciB9IGZyb20gXCJsb25nXCI7XHJcblxyXG5AQXJnc1R5cGUoKVxyXG5leHBvcnQgY2xhc3MgQWdnR2FtZVN0YXRBcmdzIHtcclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgaWQ/OiBzdHJpbmdcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHBsYXllck5hbWU/OiBzdHJpbmdcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGNhdGVnb3J5Pzogc3RyaW5nXHJcbn1cclxuXHJcbkBPYmplY3RUeXBlKClcclxuZXhwb3J0IGNsYXNzIEFnZ0dhbWVTdGF0IHtcclxuICAgIEBGaWVsZCh0eXBlID0+IFBsYXllcilcclxuICAgIHBsYXllcj86IFBsYXllclxyXG5cclxuICAgIEBGaWVsZCh0eXBlID0+IElEKVxyXG4gICAgcGxheWVySWQ6IHN0cmluZ1xyXG5cclxuICAgIEBGaWVsZCgpXHJcbiAgICBuYW1lOiBzdHJpbmdcclxuXHJcbiAgICBARmllbGQoKVxyXG4gICAgY2F0ZWdvcnk6IHN0cmluZ1xyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgcGFzc2luZ19hdHQ/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHBhc3NpbmdfY21wPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBwYXNzaW5nX3lkcz86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgcGFzc2luZ19pbnRzPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBwYXNzaW5nX3R3b3B0YT86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgcGFzc2luZ190d29wdG0/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHJ1c2hpbmdfYXR0PzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBydXNoaW5nX3lkcz86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgcnVzaGluZ190ZHM/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHJ1c2hpbmdfbG5nPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBydXNoaW5nX2xuZ3RkPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBydXNoaW5nX3R3b3B0YT86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgcnVzaGluZ190d29wdG0/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHJlY2VpdmluZ19yZWM/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHJlY2VpdmluZ195ZHM/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHJlY2VpdmluZ190ZHM/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHJlY2VpdmluZ19sbmc/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHJlY2VpdmluZ19sbmd0ZD86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgcmVjZWl2aW5nX3R3b3B0YT86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgcmVjZWl2aW5nX3R3b3B0bT86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgZnVtYmxlc19mb3JjZWQ/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGZ1bWJsZXNfbG9zdD86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgZnVtYmxlc19ub3Rmb3JjZWQ/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGZ1bWJsZXNfb29iPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBmdW1ibGVzX3JlY195ZHM/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGZ1bWJsZXNfdG90PzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBmdW1ibGVzX3JlY190ZHM/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGtpY2tpbmdfZmdtPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBraWNraW5nX2ZnYT86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAga2lja2luZ19mZ3lkcz86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAga2lja2luZ190b3RwZmc/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGtpY2tpbmdfeHBtYWRlPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBraWNraW5nX3hwYT86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAga2lja2luZ194cGI/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGtpY2tpbmdfeHB0b3Q/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHB1bnRpbmdfcHRzPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBwdW50aW5nX3lkcz86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgcHVudGluZ19hdmc/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHB1bnRpbmdfaTIwPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBwdW50aW5nX2xuZz86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAga2lja3JldF9yZXQ/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGtpY2tyZXRfYXZnPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBraWNrcmV0X3Rkcz86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAga2lja3JldF9sbmc/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGtpY2tyZXRfbG5ndGQ/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHB1bnRyZXRfcmV0PzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBwdW50cmV0X2F2Zz86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgcHVudHJldF90ZHM/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHB1bnRyZXRfbG5nPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBwdW50cmV0X2xuZ3RkPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBkZWZlbnNlX3RrbD86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgZGVmZW5zZV9hc3Q/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGRlZmVuc2VfaW50PzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBkZWZlbnNlX2ZmdW0/OiBudW1iZXJcclxufSIsImltcG9ydCBcInJlZmxlY3QtbWV0YWRhdGFcIjtcclxuaW1wb3J0IHsgT2JqZWN0VHlwZSwgRmllbGQsIElELCBBcmdzVHlwZSB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcclxuaW1wb3J0IHsgQWdnR2FtZVN0YXQgfSBmcm9tIFwiLi9BZ2dHYW1lU3RhdFwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBzY29yZURldGFpbHMge1xyXG4gIFwiMVwiOiBudW1iZXI7XHJcbiAgXCIyXCI6IG51bWJlcjtcclxuICBcIjNcIjogbnVtYmVyO1xyXG4gIFwiNFwiOiBudW1iZXI7XHJcbiAgVDogbnVtYmVyO1xyXG59XHJcblxyXG5AQXJnc1R5cGUoKVxyXG5leHBvcnQgY2xhc3MgZ2FtZVNlYXJjaEFyZ3Mge1xyXG4gIEBGaWVsZCh7IG51bGxhYmxlOiB0cnVlIH0pXHJcbiAgeWVhcj86IG51bWJlcjtcclxuXHJcbiAgQEZpZWxkKHsgbnVsbGFibGU6IHRydWUgfSlcclxuICB3ZWVrPzogbnVtYmVyO1xyXG5cclxuICBARmllbGQoeyBudWxsYWJsZTogdHJ1ZSB9KVxyXG4gIGhvbWU/OiBzdHJpbmc7XHJcblxyXG4gIEBGaWVsZCh7IG51bGxhYmxlOiB0cnVlIH0pXHJcbiAgYXdheT86IHN0cmluZztcclxuXHJcbiAgQEZpZWxkKHsgbnVsbGFibGU6IHRydWUgfSlcclxuICBzZWFzb25UeXBlPzogc3RyaW5nO1xyXG59XHJcblxyXG5AT2JqZWN0VHlwZSgpXHJcbmV4cG9ydCBjbGFzcyBHYW1lIHtcclxuICBARmllbGQodHlwZSA9PiBJRClcclxuICBnYW1laWQ6IHN0cmluZztcclxuXHJcbiAgQEZpZWxkKHsgbnVsbGFibGU6IHRydWUgfSlcclxuICB3ZGF5Pzogc3RyaW5nO1xyXG5cclxuICBARmllbGQoeyBudWxsYWJsZTogdHJ1ZSB9KVxyXG4gIG1vbnRoPzogbnVtYmVyO1xyXG5cclxuICBARmllbGQoKSBxdWFydGVyPzogc3RyaW5nO1xyXG5cclxuICBARmllbGQoKSBkYXk/OiBudW1iZXI7XHJcblxyXG4gIEBGaWVsZCgpIGdhbWVUeXBlPzogc3RyaW5nO1xyXG5cclxuICBARmllbGQoKSBob21lU2hvcnQ/OiBzdHJpbmc7XHJcblxyXG4gIEBGaWVsZCgpIGhvbWVOYW1lPzogc3RyaW5nO1xyXG5cclxuICBARmllbGQoKSBob21lU2NvcmU/OiBudW1iZXI7XHJcblxyXG4gIEBGaWVsZCgpIGF3YXlTaG9ydD86IHN0cmluZztcclxuXHJcbiAgQEZpZWxkKCkgYXdheU5hbWU/OiBzdHJpbmc7XHJcblxyXG4gIEBGaWVsZCgpIGF3YXlTY29yZT86IG51bWJlcjtcclxuXHJcbiAgQEZpZWxkKCkgcmVkem9uZT86IGJvb2xlYW47XHJcblxyXG4gIEBGaWVsZCh7IG51bGxhYmxlOiB0cnVlIH0pXHJcbiAgd2VhdGhlcjogc3RyaW5nO1xyXG5cclxuICBARmllbGQoeyBudWxsYWJsZTogdHJ1ZSB9KVxyXG4gIG1lZGlhOiBzdHJpbmc7XHJcblxyXG4gIEBGaWVsZCgpXHJcbiAgY2xvY2s6IHN0cmluZztcclxuXHJcbiAgQEZpZWxkKCkgeWw6IHN0cmluZztcclxuXHJcbiAgQEZpZWxkKCkgaG9tZVNjb3JlX3ExOiBudW1iZXI7XHJcblxyXG4gIEBGaWVsZCgpIGhvbWVTY29yZV9xMjogbnVtYmVyO1xyXG5cclxuICBARmllbGQoKSBob21lU2NvcmVfcTM6IG51bWJlcjtcclxuXHJcbiAgQEZpZWxkKCkgaG9tZVNjb3JlX3E0OiBudW1iZXI7XHJcblxyXG4gIEBGaWVsZCgpIGF3YXlTY29yZV9xMTogbnVtYmVyO1xyXG5cclxuICBARmllbGQoKSBhd2F5U2NvcmVfcTI6IG51bWJlcjtcclxuXHJcbiAgQEZpZWxkKCkgYXdheVNjb3JlX3EzOiBudW1iZXI7XHJcblxyXG4gIEBGaWVsZCgpIGF3YXlTY29yZV9xNDogbnVtYmVyO1xyXG5cclxuICBARmllbGQodHlwZSA9PiBbQWdnR2FtZVN0YXRdKVxyXG4gIGFnZ3JlZ2F0ZWRHYW1lU3RhdHM/OiBBZ2dHYW1lU3RhdFtdO1xyXG59XHJcbiIsImltcG9ydCB7IE9iamVjdFR5cGUsIEZpZWxkLCBJRCB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcclxuXHJcbkBPYmplY3RUeXBlKClcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcclxuICAgIEBGaWVsZCh0eXBlID0+IElEKVxyXG4gICAgcGxheWVySWQ6IHN0cmluZ1xyXG5cclxuICAgIEBGaWVsZCh7IG51bGxhYmxlOiB0cnVlIH0pXHJcbiAgICBmaXJzdE5hbWU6IHN0cmluZ1xyXG5cclxuICAgIEBGaWVsZCh7IG51bGxhYmxlOiB0cnVlIH0pXHJcbiAgICBsYXN0TmFtZTogc3RyaW5nXHJcblxyXG4gICAgQEZpZWxkKHsgbnVsbGFibGU6IHRydWUgfSlcclxuICAgIGZ1bGxOYW1lOiBzdHJpbmdcclxuXHJcbiAgICBARmllbGQoeyBudWxsYWJsZTogdHJ1ZSB9KVxyXG4gICAgYWdlOiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoeyBudWxsYWJsZTogdHJ1ZSB9KVxyXG4gICAgY29sbGVnZTogc3RyaW5nXHJcblxyXG4gICAgQEZpZWxkKHsgbnVsbGFibGU6IHRydWUgfSlcclxuICAgIC8vIGluIGluY2hlc1xyXG4gICAgaGVpZ2h0OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoeyBudWxsYWJsZTogdHJ1ZSB9KVxyXG4gICAgbnVtYmVyOiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoeyBudWxsYWJsZTogdHJ1ZSB9KVxyXG4gICAgcG9zaXRpb246IHN0cmluZ1xyXG5cclxuICAgIEBGaWVsZCgpXHJcbiAgICBnc2lzSWQ6IHN0cmluZztcclxuXHJcbiAgICBARmllbGQoKVxyXG4gICAgcHJvZmlsZUlkOiBzdHJpbmdcclxuXHJcbiAgICBARmllbGQoKVxyXG4gICAgcHJvZmlsZVVybDogc3RyaW5nXHJcblxyXG4gICAgQEZpZWxkKClcclxuICAgIGJpcnRoRGF0ZTogc3RyaW5nXHJcblxyXG4gICAgQEZpZWxkKHsgbnVsbGFibGU6IHRydWUgfSlcclxuICAgIGJpcnRoQ2l0eTogc3RyaW5nXHJcblxyXG4gICAgQEZpZWxkKHsgbnVsbGFibGU6IHRydWUgfSlcclxuICAgIHN0YXR1cz86IHN0cmluZ1xyXG5cclxuICAgIEBGaWVsZCh7IG51bGxhYmxlOiB0cnVlIH0pXHJcbiAgICB0ZWFtOiBzdHJpbmdcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHdlaWdodDogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICB5ZWFyc1Bybz86IG51bWJlclxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXhpb3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2hlZXJpb1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkb3RlbnZcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnMtZXh0cmFcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZ3JhcGhxbC15b2dhXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImxvZGFzaFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWZsZWN0LW1ldGFkYXRhXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInR5cGUtZ3JhcGhxbFwiKTsiXSwic291cmNlUm9vdCI6IiJ9