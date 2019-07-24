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
/******/ 	var hotCurrentHash = "cad51d6663c1bfe4b272";
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
/* WEBPACK VAR INJECTION */(function(__dirname) {
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
const graphql_yoga_1 = __webpack_require__(/*! graphql-yoga */ "graphql-yoga");
const type_graphql_1 = __webpack_require__(/*! type-graphql */ "type-graphql");
const GameDetailResolver_1 = __webpack_require__(/*! ./resolvers/GameDetailResolver */ "./src/resolvers/GameDetailResolver.ts");
const AggGameStatResolver_1 = __importDefault(__webpack_require__(/*! ./resolvers/AggGameStatResolver */ "./src/resolvers/AggGameStatResolver.ts"));
const PlayerResolver_1 = __importDefault(__webpack_require__(/*! ./resolvers/PlayerResolver */ "./src/resolvers/PlayerResolver.ts"));
const GameResolver_1 = __importDefault(__webpack_require__(/*! ./resolvers/GameResolver */ "./src/resolvers/GameResolver.ts"));
const path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
const nflgame_1 = __importDefault(__webpack_require__(/*! ./nflgame/nflgame */ "./src/nflgame/nflgame.ts"));
nflgame_1.default.getInstance(path_1.default.join(__dirname, '../data/'));
// // GRAPHQL PORTION
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = yield type_graphql_1.buildSchema({
            resolvers: [
                GameDetailResolver_1.GameDetailsResolver,
                AggGameStatResolver_1.default,
                PlayerResolver_1.default,
                GameResolver_1.default
            ],
            validate: false,
            emitSchemaFile: true,
        });
        const server = new graphql_yoga_1.GraphQLServer({
            schema,
        });
        server.start(() => console.log("Server is running on http://localhost:4000"));
    });
}
bootstrap();
// nflGame.getInstance().searchSchedule({home: 'NYG', year: 2011}).then((result) => {
//     console.log(result);
// })
// HRM
// if (module.hot) {
//     module.hot.accept();
//     module.hot.dispose(() => console.log('Module disposed. '));
// }
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

/* WEBPACK VAR INJECTION */}.call(this, "/"))

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
        Object.keys(stats.passing).forEach((playerId) => {
            const stat = {
                playerId: playerId,
                category: 'passing',
                name: stats.passing[playerId].name,
                passing_att: stats.passing[playerId].att,
                passing_cmp: stats.passing[playerId].cmp,
                passing_yds: stats.passing[playerId].yds,
                passing_tds: stats.passing[playerId].tds,
                passing_ints: stats.passing[playerId].ints,
                passing_twopta: stats.passing[playerId].twopta,
                passing_twoptm: stats.passing[playerId].twoptm,
            };
            playerStats.push(stat);
        });
    }
    if (stats.rushing) {
        Object.keys(stats.rushing).forEach((playerId) => {
            const stat = {
                playerId: playerId,
                category: 'rushing',
                name: stats.rushing[playerId].name,
                rushing_att: stats.rushing[playerId].att,
                rushing_yds: stats.rushing[playerId].yds,
                rushing_tds: stats.rushing[playerId].tds,
                rushing_lng: stats.rushing[playerId].lng,
                rushing_lngtd: stats.rushing[playerId].lngtd,
                rushing_twopta: stats.rushing[playerId].twopta,
                rushing_twoptm: stats.rushing[playerId].twoptm,
            };
            playerStats.push(stat);
        });
    }
    if (stats.receiving) {
        Object.keys(stats.receiving).forEach((playerId) => {
            const stat = {
                playerId: playerId,
                category: 'receiving',
                name: stats.receiving[playerId].name,
                receiving_rec: stats.receiving[playerId].rec,
                receiving_yds: stats.receiving[playerId].yds,
                receiving_tds: stats.receiving[playerId].tds,
                receiving_lng: stats.receiving[playerId].lng,
                receiving_lngtd: stats.receiving[playerId].lngtd,
                receiving_twopta: stats.receiving[playerId].twopta,
                receiving_twoptm: stats.receiving[playerId].twoptm,
            };
            playerStats.push(stat);
        });
    }
    if (stats.fumbles) {
        Object.keys(stats.fumbles).forEach((playerId) => {
            const stat = {
                playerId: playerId,
                category: 'fumbles',
                name: stats.fumbles[playerId].name,
                fumbles_forced: stats.fumbles[playerId].forced,
                fumbles_lost: stats.fumbles[playerId].lost,
                fumbles_notforced: stats.fumbles[playerId].notforced,
                fumbles_oob: stats.fumbles[playerId].oob,
                fumbles_rec: stats.fumbles[playerId].rec,
                fumbles_rec_yds: stats.fumbles[playerId].rec_yds,
                fumbles_tot: stats.fumbles[playerId].tot,
                fumbles_rec_tds: stats.fumbles[playerId].rec_tds,
            };
            playerStats.push(stat);
        });
    }
    if (stats.kicking) {
        Object.keys(stats.kicking).forEach((playerId) => {
            const stat = {
                playerId: playerId,
                category: 'kicking',
                name: stats.kicking[playerId].name,
                kicking_fgm: stats.kicking[playerId].fgm,
                kicking_fga: stats.kicking[playerId].fga,
                kicking_fgyds: stats.kicking[playerId].fgyds,
                kicking_totpfg: stats.kicking[playerId].totpfg,
                kicking_xpmade: stats.kicking[playerId].xpmade,
                kicking_xpa: stats.kicking[playerId].xpa,
                kicking_xpb: stats.kicking[playerId].xpb,
                kicking_xptot: stats.kicking[playerId].xptot,
            };
            playerStats.push(stat);
        });
    }
    if (stats.punting) {
        Object.keys(stats.punting).forEach((playerId) => {
            const stat = {
                playerId: playerId,
                category: 'punting',
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
        Object.keys(stats.kickret).forEach((playerId) => {
            const stat = {
                playerId: playerId,
                category: 'kickret',
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
        Object.keys(stats.puntret).forEach((playerId) => {
            const stat = {
                playerId: playerId,
                category: 'puntret',
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
        Object.keys(stats.defense).forEach((playerId) => {
            const stat = {
                playerId: playerId,
                category: 'defense',
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
function parseGame(g) {
    const game = {
        weather: g.weather ? g.weather : '',
        media: g.media ? g.media : '',
        yl: g.yl,
        qtr: g.qtr,
        note: g.note ? g.note : '',
        down: g.down,
        togo: g.togo,
        redzone: g.redzone,
        clock: g.clock,
        posteam: g.posteam,
        stadium: g.stadium ? g.stadium : '',
        homeShort: g.home.abbr,
        awayShort: g.away.abbr
    };
    return game;
}
exports.parseGame = parseGame;
function gamesGen(year, week, home, away, kind = 'REG', started = false) {
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
const nflCurrentSchedule = 'http://www.nfl.com/liveupdate/scorestrip/ss.xml';
const nflCurrentSchedulePostSeason = 'http://www.nfl.com/liveupdate/scorestrip/postseason/ss.xml';
const nflRosterUrl = 'http://www.nfl.com/teams/roster?team=';
const nflProfileUrl = 'http://www.nfl.com/players/profile?id=';
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
                ['PRE', 0],
                ['PRE', 1],
                ['PRE', 2],
                ['PRE', 3],
                ['PRE', 4],
                ['PRE', 5],
                ['REG', 1],
                ['REG', 2],
                ['REG', 3],
                ['REG', 4],
                ['REG', 5],
                ['REG', 6],
                ['REG', 7],
                ['REG', 8],
                ['REG', 9],
                ['REG', 10],
                ['REG', 11],
                ['REG', 12],
                ['REG', 13],
                ['REG', 14],
                ['REG', 15],
                ['REG', 16],
                ['REG', 17],
                ['REG', 18],
                ['POST', 1],
                ['POST', 2],
                ['POST', 3],
                ['POST', 4],
                ['POST', 5],
            ];
            const scheduleWeeks = [];
            // There should be a better way to write this
            // 1. generate all the weeks up to the current year
            const mapWeeks = lodash_1.default.map(lodash_1.default.range(2009, currentWeek.year + 1), 
            // 2. generate based on the list of season games
            (y) => nflYear.map((w) => {
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
                if (allWeeks[i].year == currentWeek.year
                    && allWeeks[i].week == currentWeek.week
                    && allWeeks[i].stype == currentWeek.stype) {
                    i = allWeeks.length;
                }
            }
            return lodash_1.default.reverse(scheduleWeeks);
        });
    }
    static getScheduleUrl(year, stype, week) {
        // Returns the NFL.com XML schedule URL. 
        const baseUrl = 'https://www.nfl.com/ajax/scorestrip?';
        if (stype == 'POST') {
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
                $('g').each((i, e) => {
                    const gid = $(e).attr('eid');
                    games[i] = {
                        gameid: gid,
                        wday: $(e).attr('d'),
                        gsis: +$(e).attr('gsis'),
                        year: params.year,
                        month: +gid.slice(4, 6),
                        day: +gid.slice(6, 8),
                        time: $(e).attr('t'),
                        quarter: $(e).attr('q'),
                        gameType: params.stype,
                        week: params.week,
                        homeShort: $(e).attr('h'),
                        homeName: $(e).attr('hnn'),
                        homeScore: +$(e).attr('hs'),
                        awayShort: $(e).attr('v'),
                        awayName: $(e).attr('vnn'),
                        awayScore: +$(e).attr('vs'),
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
                week: +$('gms').attr('w'),
                year: +$('gms').attr('y'),
                stype: 'REG'
            };
            const p = $('gms').attr('t');
            if (p == 'P') {
                week.stype = 'PRE';
            }
            else if (p == 'POST' || p == 'PRO') {
                week.stype = 'POST';
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
            const evens = $('tr[class=even]');
            const odds = $('tr[class=odd]');
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
                            if (name.includes(',')) {
                                player.lastName = name.split(',')[0];
                                player.firstName = name.split(',')[1];
                            }
                            else {
                                player.lastName = name;
                                player.firstName = '';
                            }
                            player.profileUrl = $(e).children().first().attr('href');
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
const lodash_1 = __importDefault(__webpack_require__(/*! lodash */ "lodash"));
const nflPlayer_1 = __webpack_require__(/*! ./nflPlayer */ "./src/nflgame/nflPlayer.ts");
const Game_1 = __webpack_require__(/*! ./Game */ "./src/nflgame/Game.ts");
function transposeArgs(args) {
    const params = {
        homeShort: args.home,
        awayShort: args.away,
        gameType: args.season_type,
        week: args.week,
        year: args.year
    };
    return lodash_1.default.omitBy(params, lodash_1.default.isUndefined);
}
class nflGame {
    constructor(filePath) {
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
            throw new Error('filepath is not set, cannot retrieve cache');
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
            try {
                if (this.schedule.length < 1) {
                    yield this.regenerateSchedule();
                    return lodash_1.default.filter(this.schedule, transposeArgs(args));
                }
                else {
                    return lodash_1.default.filter(this.schedule, transposeArgs(args));
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    updatePlayers() {
        return __awaiter(this, void 0, void 0, function* () {
            // not needed as players can be fetched on the fly
        });
    }
    getGame(gameid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nflGame = yield this.getGamecenterGame(gameid);
                const game = Game_1.parseGame(nflGame);
                game.gameid = gameid;
                return game;
            }
            catch (error) {
                console.error(error);
                return {};
                // throw error;
            }
        });
    }
    getGamecenterGame(gameid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!gameid) {
                throw new Error('no gameid passed');
            }
            try {
                const cacheGame = yield this.cache.getGame(gameid);
                if (!cacheGame) {
                    console.log('game is not found in cache, pulling from nfl.com');
                    // if cached game is not found,
                    // we fetch the game from NFL.com
                    const gameResponse = yield this.fetchGame(gameid);
                    // and save it to cache
                    yield this.cache.saveGame(gameid, gameResponse);
                    // before returning it to the user
                    // @ts-ignore
                    gameResponse.gameid = gameid;
                    return gameResponse;
                }
                else {
                    // if the game is found in cache that is returned instead.
                    console.log('game found in cache');
                    cacheGame.gameid = gameid;
                    return cacheGame;
                }
            }
            catch (err) {
                throw err;
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
                    console.log('player not found... fetching');
                    const player = yield this.fetchPlayer(gsisId);
                    console.log(`added ${player.fullName}`);
                    return player;
                }
                else {
                    console.log('player found');
                    return match[0];
                }
            }
            catch (err) {
                console.error(err);
                return {};
            }
        });
    }
    getGamesBySchedule(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const match = params;
            // console.log(match)
            return lodash_1.default.filter(this.schedule, match);
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

/***/ "./src/resolvers/GameDetailResolver.ts":
/*!*********************************************!*\
  !*** ./src/resolvers/GameDetailResolver.ts ***!
  \*********************************************/
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
const Game_1 = __importDefault(__webpack_require__(/*! ../schemas/Game */ "./src/schemas/Game.ts"));
const nflgame_1 = __importDefault(__webpack_require__(/*! ../nflgame/nflgame */ "./src/nflgame/nflgame.ts"));
// import { getGameById, getGameStats } from '../nflgame/Game'
// @Resolver(of => Game)
// export default class {
//     @Query(returns => Game, { nullable: true })
//     async gameByid(@Arg("eid") eid: number): Promise<any> { }
// }
let GameDetailsResolver = class GameDetailsResolver {
    getGameById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield nflgame_1.default.getInstance().getGamecenterGame(id);
            game.eid = id;
            return game;
        });
    }
    aggregatedGameStats(game) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(game.gameid);
                // @ts-ignore
                let stats = yield nflgame_1.default.getInstance().getAggGameStats(game.gameid);
                // console.log(params);
                // if (params.name || params.category) {
                //     const filter = {}
                //     if (params.name) {
                //         //@ts-ignore
                //         filter.name = params.name
                //     }
                //     if (params.category) {
                //         // @ts-ignore
                //         filter.category = params.category
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
};
__decorate([
    type_graphql_1.Query(returns => Game_1.default),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GameDetailsResolver.prototype, "getGameById", null);
__decorate([
    type_graphql_1.FieldResolver(),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Game_1.default]),
    __metadata("design:returntype", Promise)
], GameDetailsResolver.prototype, "aggregatedGameStats", null);
GameDetailsResolver = __decorate([
    type_graphql_1.Resolver(of => Game_1.default)
], GameDetailsResolver);
exports.GameDetailsResolver = GameDetailsResolver;


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
// import Schedule from '../schemas/Schedule';
const Schedule_1 = __webpack_require__(/*! ../schemas/Schedule */ "./src/schemas/Schedule.ts");
const nflgame_1 = __importDefault(__webpack_require__(/*! ../nflgame/nflgame */ "./src/nflgame/nflgame.ts"));
let ScheduleResolver = class ScheduleResolver {
    searchSchedule(input) {
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
    game(schedule) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const game = yield nflgame_1.default.getInstance().getGame(schedule.gameid);
                return game;
            }
            catch (error) {
                return {};
            }
        });
    }
};
__decorate([
    type_graphql_1.Query(returns => [Schedule_1.Schedule], { nullable: true }),
    __param(0, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Schedule_1.searchScheduleArgs]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "searchSchedule", null);
__decorate([
    type_graphql_1.FieldResolver(),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Schedule_1.Schedule]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "game", null);
ScheduleResolver = __decorate([
    type_graphql_1.Resolver(of => Schedule_1.Schedule)
], ScheduleResolver);
exports.default = ScheduleResolver;


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
    __param(0, type_graphql_1.Arg('id')),
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
const type_graphql_1 = __webpack_require__(/*! type-graphql */ "type-graphql");
const AggGameStat_1 = __webpack_require__(/*! ./AggGameStat */ "./src/schemas/AggGameStat.ts");
// ObjectType defines class as a GraphQL type
let GameDetails = class GameDetails {
};
__decorate([
    type_graphql_1.Field(type => type_graphql_1.ID),
    __metadata("design:type", String)
], GameDetails.prototype, "gameid", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], GameDetails.prototype, "weather", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], GameDetails.prototype, "media", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], GameDetails.prototype, "yl", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], GameDetails.prototype, "qtr", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], GameDetails.prototype, "note", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], GameDetails.prototype, "down", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], GameDetails.prototype, "togo", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], GameDetails.prototype, "redzone", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], GameDetails.prototype, "clock", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], GameDetails.prototype, "stadium", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], GameDetails.prototype, "posteam", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], GameDetails.prototype, "homeShort", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], GameDetails.prototype, "awayShort", void 0);
__decorate([
    type_graphql_1.Field(type => [AggGameStat_1.AggGameStat], { nullable: true }),
    __metadata("design:type", Array)
], GameDetails.prototype, "aggregatedGameStats", void 0);
GameDetails = __decorate([
    type_graphql_1.ObjectType()
], GameDetails);
exports.default = GameDetails;


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

/***/ "./src/schemas/Schedule.ts":
/*!*********************************!*\
  !*** ./src/schemas/Schedule.ts ***!
  \*********************************/
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
const Game_1 = __importDefault(__webpack_require__(/*! ./Game */ "./src/schemas/Game.ts"));
let searchScheduleArgs = class searchScheduleArgs {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], searchScheduleArgs.prototype, "year", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], searchScheduleArgs.prototype, "week", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], searchScheduleArgs.prototype, "home", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], searchScheduleArgs.prototype, "away", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], searchScheduleArgs.prototype, "season_type", void 0);
searchScheduleArgs = __decorate([
    type_graphql_1.ArgsType()
], searchScheduleArgs);
exports.searchScheduleArgs = searchScheduleArgs;
let Schedule = class Schedule {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Schedule.prototype, "gameid", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Schedule.prototype, "gsis", void 0);
__decorate([
    type_graphql_1.Field(type => Game_1.default),
    __metadata("design:type", Game_1.default)
], Schedule.prototype, "game", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Schedule.prototype, "month", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Schedule.prototype, "quarter", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Schedule.prototype, "week", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Schedule.prototype, "gameType", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Schedule.prototype, "homeShort", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Schedule.prototype, "homeName", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Schedule.prototype, "homeScore", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Schedule.prototype, "awayShort", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Schedule.prototype, "awayName", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Schedule.prototype, "awayScore", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Schedule.prototype, "time", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Schedule.prototype, "day", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Schedule.prototype, "wday", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Schedule.prototype, "year", void 0);
Schedule = __decorate([
    type_graphql_1.ObjectType()
], Schedule);
exports.Schedule = Schedule;


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

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2hvdC9sb2cuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvcG9sbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL25mbGdhbWUvR2FtZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbmZsZ2FtZS9qc29uQ2FjaGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL25mbGdhbWUvbmZsQXBpLnRzIiwid2VicGFjazovLy8uL3NyYy9uZmxnYW1lL25mbFBsYXllci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbmZsZ2FtZS9uZmxnYW1lLnRzIiwid2VicGFjazovLy8uL3NyYy9yZXNvbHZlcnMvQWdnR2FtZVN0YXRSZXNvbHZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVzb2x2ZXJzL0dhbWVEZXRhaWxSZXNvbHZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVzb2x2ZXJzL0dhbWVSZXNvbHZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVzb2x2ZXJzL1BsYXllclJlc29sdmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9zY2hlbWFzL0FnZ0dhbWVTdGF0LnRzIiwid2VicGFjazovLy8uL3NyYy9zY2hlbWFzL0dhbWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjaGVtYXMvUGxheWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9zY2hlbWFzL1NjaGVkdWxlLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcImF4aW9zXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY2hlZXJpb1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZzLWV4dHJhXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZ3JhcGhxbC15b2dhXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibG9kYXNoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlZmxlY3QtbWV0YWRhdGFcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0eXBlLWdyYXBocWxcIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQTZCO0FBQzdCLHFDQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBcUIsZ0JBQWdCO0FBQ3JDO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsNkJBQXFCLGdCQUFnQjtBQUNyQztBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBCQUFrQiw4QkFBOEI7QUFDaEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLDJCQUEyQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBbUIsY0FBYztBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0JBQWdCLEtBQUs7QUFDckI7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsWUFBWTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNB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bGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdHZhciBjaHVuayA9IHJlcXVpcmUoXCIuL1wiICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiKTtcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmsuaWQsIGNodW5rLm1vZHVsZXMpO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QoKSB7XG4gXHRcdHRyeSB7XG4gXHRcdFx0dmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIuL1wiICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCIpO1xuIFx0XHR9IGNhdGNoIChlKSB7XG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuIFx0XHR9XG4gXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodXBkYXRlKTtcbiBcdH1cblxuIFx0Ly9lc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKSB7XG4gXHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHR9XG5cbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCJjYWQ1MWQ2NjYzYzFiZmU0YjI3MlwiO1xuIFx0dmFyIGhvdFJlcXVlc3RUaW1lb3V0ID0gMTAwMDA7XG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcbiBcdHZhciBob3RDdXJyZW50Q2hpbGRNb2R1bGU7XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkge1xuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0aWYgKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiBcdFx0XHRpZiAobWUuaG90LmFjdGl2ZSkge1xuIFx0XHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcbiBcdFx0XHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA9PT0gLTEpIHtcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpID09PSAtMSkge1xuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICtcbiBcdFx0XHRcdFx0XHRyZXF1ZXN0ICtcbiBcdFx0XHRcdFx0XHRcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgK1xuIFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHQpO1xuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XG4gXHRcdH07XG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcbiBcdFx0XHRcdH0sXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9O1xuIFx0XHR9O1xuIFx0XHRmb3IgKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiZcbiBcdFx0XHRcdG5hbWUgIT09IFwiZVwiICYmXG4gXHRcdFx0XHRuYW1lICE9PSBcInRcIlxuIFx0XHRcdCkge1xuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcbiBcdFx0XHRpZiAoaG90U3RhdHVzID09PSBcInJlYWR5XCIpIGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XG4gXHRcdFx0XHR0aHJvdyBlcnI7XG4gXHRcdFx0fSk7XG5cbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XG4gXHRcdFx0XHRpZiAoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xuIFx0XHRcdFx0XHRpZiAoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xuIFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fTtcbiBcdFx0Zm4udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdFx0aWYgKG1vZGUgJiAxKSB2YWx1ZSA9IGZuKHZhbHVlKTtcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy50KHZhbHVlLCBtb2RlICYgfjEpO1xuIFx0XHR9O1xuIFx0XHRyZXR1cm4gZm47XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7XG4gXHRcdHZhciBob3QgPSB7XG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcblxuIFx0XHRcdC8vIE1vZHVsZSBBUElcbiBcdFx0XHRhY3RpdmU6IHRydWUsXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIikgaG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdFx0ZWxzZSBob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XG4gXHRcdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXG4gXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XG4gXHRcdFx0fSxcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gXHRcdFx0fSxcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuIFx0XHRcdH0sXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdH0sXG5cbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHRpZiAoIWwpIHJldHVybiBob3RTdGF0dXM7XG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuIFx0XHRcdH0sXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbiBcdFx0XHR9LFxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHR9LFxuXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXG4gXHRcdH07XG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcbiBcdFx0cmV0dXJuIGhvdDtcbiBcdH1cblxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XG5cbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xuIFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcbiBcdH1cblxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3REZWZlcnJlZDtcblxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xuXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XG4gXHRcdHZhciBpc051bWJlciA9ICtpZCArIFwiXCIgPT09IGlkO1xuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHtcbiBcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcbiBcdFx0fVxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcbiBcdFx0XHRpZiAoIXVwZGF0ZSkge1xuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0XHRcdHJldHVybiBudWxsO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xuXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XG4gXHRcdFx0XHR9O1xuIFx0XHRcdH0pO1xuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xuIFx0XHRcdHZhciBjaHVua0lkID0gXCJtYWluXCI7XG4gXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWxvbmUtYmxvY2tzXG4gXHRcdFx0e1xuIFx0XHRcdFx0LypnbG9iYWxzIGNodW5rSWQgKi9cbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiICYmXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nID09PSAwICYmXG4gXHRcdFx0XHRob3RXYWl0aW5nRmlsZXMgPT09IDBcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7XG4gXHRcdGlmICghaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxuIFx0XHRcdHJldHVybjtcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcbiBcdFx0Zm9yICh2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmICgtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0aWYgKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlcysrO1xuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcbiBcdFx0aG90U2V0U3RhdHVzKFwicmVhZHlcIik7XG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XG4gXHRcdGlmICghZGVmZXJyZWQpIHJldHVybjtcbiBcdFx0aWYgKGhvdEFwcGx5T25VcGRhdGUpIHtcbiBcdFx0XHQvLyBXcmFwIGRlZmVycmVkIG9iamVjdCBpbiBQcm9taXNlIHRvIG1hcmsgaXQgYXMgYSB3ZWxsLWhhbmRsZWQgUHJvbWlzZSB0b1xuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxuIFx0XHRcdC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00NjU2NjZcbiBcdFx0XHRQcm9taXNlLnJlc29sdmUoKVxuIFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRcdHJldHVybiBob3RBcHBseShob3RBcHBseU9uVXBkYXRlKTtcbiBcdFx0XHRcdH0pXG4gXHRcdFx0XHQudGhlbihcbiBcdFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XG4gXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuIFx0XHRcdFx0XHR9LFxuIFx0XHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcbiBcdFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0KTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJyZWFkeVwiKVxuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcbiBcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiBcdFx0dmFyIGNiO1xuIFx0XHR2YXIgaTtcbiBcdFx0dmFyIGo7XG4gXHRcdHZhciBtb2R1bGU7XG4gXHRcdHZhciBtb2R1bGVJZDtcblxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG5cbiBcdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMubWFwKGZ1bmN0aW9uKGlkKSB7XG4gXHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRjaGFpbjogW2lkXSxcbiBcdFx0XHRcdFx0aWQ6IGlkXG4gXHRcdFx0XHR9O1xuIFx0XHRcdH0pO1xuIFx0XHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gXHRcdFx0XHR2YXIgcXVldWVJdGVtID0gcXVldWUucG9wKCk7XG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmICghbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZCkgY29udGludWU7XG4gXHRcdFx0XHRpZiAobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XG4gXHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKG1vZHVsZS5ob3QuX21haW4pIHtcbiBcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInVuYWNjZXB0ZWRcIixcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XG4gXHRcdFx0XHRcdGlmICghcGFyZW50KSBjb250aW51ZTtcbiBcdFx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuIFx0XHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXG4gXHRcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAob3V0ZGF0ZWRNb2R1bGVzLmluZGV4T2YocGFyZW50SWQpICE9PSAtMSkgY29udGludWU7XG4gXHRcdFx0XHRcdGlmIChwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSlcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XG4gXHRcdFx0XHRcdFx0Y29udGludWU7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2gocGFyZW50SWQpO1xuIFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuIFx0XHRcdFx0XHRcdGlkOiBwYXJlbnRJZFxuIFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG5cbiBcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0dHlwZTogXCJhY2NlcHRlZFwiLFxuIFx0XHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXG4gXHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llczogb3V0ZGF0ZWREZXBlbmRlbmNpZXNcbiBcdFx0XHR9O1xuIFx0XHR9XG5cbiBcdFx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xuIFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xuIFx0XHRcdFx0aWYgKGEuaW5kZXhPZihpdGVtKSA9PT0gLTEpIGEucHVzaChpdGVtKTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxuIFx0XHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdHZhciBhcHBsaWVkVXBkYXRlID0ge307XG5cbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcbiBcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIlxuIFx0XHRcdCk7XG4gXHRcdH07XG5cbiBcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xuIFx0XHRcdFx0bW9kdWxlSWQgPSB0b01vZHVsZUlkKGlkKTtcbiBcdFx0XHRcdC8qKiBAdHlwZSB7VE9ET30gKi9cbiBcdFx0XHRcdHZhciByZXN1bHQ7XG4gXHRcdFx0XHRpZiAoaG90VXBkYXRlW2lkXSkge1xuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdHJlc3VsdCA9IHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHQvKiogQHR5cGUge0Vycm9yfGZhbHNlfSAqL1xuIFx0XHRcdFx0dmFyIGFib3J0RXJyb3IgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBkb0FwcGx5ID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgY2hhaW5JbmZvID0gXCJcIjtcbiBcdFx0XHRcdGlmIChyZXN1bHQuY2hhaW4pIHtcbiBcdFx0XHRcdFx0Y2hhaW5JbmZvID0gXCJcXG5VcGRhdGUgcHJvcGFnYXRpb246IFwiICsgcmVzdWx0LmNoYWluLmpvaW4oXCIgLT4gXCIpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0c3dpdGNoIChyZXN1bHQudHlwZSkge1xuIFx0XHRcdFx0XHRjYXNlIFwic2VsZi1kZWNsaW5lZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiZGVjbGluZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBkZWNsaW5lZCBkZXBlbmRlbmN5OiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRcIiBpbiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0LnBhcmVudElkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJ1bmFjY2VwdGVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25VbmFjY2VwdGVkKSBvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2UgXCIgKyBtb2R1bGVJZCArIFwiIGlzIG5vdCBhY2NlcHRlZFwiICsgY2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiYWNjZXB0ZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkFjY2VwdGVkKSBvcHRpb25zLm9uQWNjZXB0ZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRkb0FwcGx5ID0gdHJ1ZTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImRpc3Bvc2VkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EaXNwb3NlZCkgb3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0ZG9EaXNwb3NlID0gdHJ1ZTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcbiBcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4Y2VwdGlvbiB0eXBlIFwiICsgcmVzdWx0LnR5cGUpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGFib3J0RXJyb3IpIHtcbiBcdFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiYWJvcnRcIik7XG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChkb0FwcGx5KSB7XG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gaG90VXBkYXRlW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0XHRcdFx0Zm9yIChtb2R1bGVJZCBpbiByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRcdFx0XHRpZiAoXG4gXHRcdFx0XHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoXG4gXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcyxcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWRcbiBcdFx0XHRcdFx0XHRcdClcbiBcdFx0XHRcdFx0XHQpIHtcbiBcdFx0XHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKVxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0gPSBbXTtcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KFxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0sXG4gXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF1cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoZG9EaXNwb3NlKSB7XG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IHdhcm5VbmV4cGVjdGVkUmVxdWlyZTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXG4gXHRcdHZhciBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0Zm9yIChpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdG1vZHVsZUlkID0gb3V0ZGF0ZWRNb2R1bGVzW2ldO1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdICYmXG4gXHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZCAmJlxuIFx0XHRcdFx0Ly8gcmVtb3ZlZCBzZWxmLWFjY2VwdGVkIG1vZHVsZXMgc2hvdWxkIG5vdCBiZSByZXF1aXJlZFxuIFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gIT09IHdhcm5VbmV4cGVjdGVkUmVxdWlyZVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXG4gXHRcdFx0XHR9KTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBOb3cgaW4gXCJkaXNwb3NlXCIgcGhhc2VcbiBcdFx0aG90U2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xuIFx0XHRcdGlmIChob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSA9PT0gZmFsc2UpIHtcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcbiBcdFx0XHR9XG4gXHRcdH0pO1xuXG4gXHRcdHZhciBpZHg7XG4gXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xuIFx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuIFx0XHRcdG1vZHVsZUlkID0gcXVldWUucG9wKCk7XG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0aWYgKCFtb2R1bGUpIGNvbnRpbnVlO1xuXG4gXHRcdFx0dmFyIGRhdGEgPSB7fTtcblxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xuIFx0XHRcdHZhciBkaXNwb3NlSGFuZGxlcnMgPSBtb2R1bGUuaG90Ll9kaXNwb3NlSGFuZGxlcnM7XG4gXHRcdFx0Zm9yIChqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0Y2IgPSBkaXNwb3NlSGFuZGxlcnNbal07XG4gXHRcdFx0XHRjYihkYXRhKTtcbiBcdFx0XHR9XG4gXHRcdFx0aG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdID0gZGF0YTtcblxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXG4gXHRcdFx0bW9kdWxlLmhvdC5hY3RpdmUgPSBmYWxzZTtcblxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxuIFx0XHRcdGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcblxuIFx0XHRcdC8vIHdoZW4gZGlzcG9zaW5nIHRoZXJlIGlzIG5vIG5lZWQgdG8gY2FsbCBkaXNwb3NlIGhhbmRsZXJcbiBcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cbiBcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgY2hpbGQgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZS5jaGlsZHJlbltqXV07XG4gXHRcdFx0XHRpZiAoIWNoaWxkKSBjb250aW51ZTtcbiBcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIHtcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxuIFx0XHR2YXIgZGVwZW5kZW5jeTtcbiBcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xuIFx0XHRmb3IgKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZClcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKG1vZHVsZSkge1xuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xuIFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xuIFx0XHRcdFx0XHRcdGlmIChpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTm93IGluIFwiYXBwbHlcIiBwaGFzZVxuIFx0XHRob3RTZXRTdGF0dXMoXCJhcHBseVwiKTtcblxuIFx0XHRob3RDdXJyZW50SGFzaCA9IGhvdFVwZGF0ZU5ld0hhc2g7XG5cbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXG4gXHRcdGZvciAobW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBwbGllZFVwZGF0ZSwgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXG4gXHRcdHZhciBlcnJvciA9IG51bGw7XG4gXHRcdGZvciAobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAobW9kdWxlKSB7XG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHR2YXIgY2FsbGJhY2tzID0gW107XG4gXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcbiBcdFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xuIFx0XHRcdFx0XHRcdGlmIChjYikge1xuIFx0XHRcdFx0XHRcdFx0aWYgKGNhbGxiYWNrcy5pbmRleE9mKGNiKSAhPT0gLTEpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XG4gXHRcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHRcdGNiKG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcbiBcdFx0XHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJhY2NlcHQtZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldLFxuIFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcbiBcdFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xuIFx0XHRmb3IgKGkgPSAwOyBpIDwgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcbiBcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XG4gXHRcdFx0dHJ5IHtcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xuIFx0XHRcdH0gY2F0Y2ggKGVycikge1xuIFx0XHRcdFx0aWYgKHR5cGVvZiBpdGVtLmVycm9ySGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gXHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcbiBcdFx0XHRcdFx0fSBjYXRjaCAoZXJyMikge1xuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxuIFx0XHRcdFx0XHRcdFx0XHRvcmlnaW5hbEVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnIyO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGhhbmRsZSBlcnJvcnMgaW4gYWNjZXB0IGhhbmRsZXJzIGFuZCBzZWxmIGFjY2VwdGVkIG1vZHVsZSBsb2FkXG4gXHRcdGlmIChlcnJvcikge1xuIFx0XHRcdGhvdFNldFN0YXR1cyhcImZhaWxcIik7XG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiBcdFx0fVxuXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gXHRcdFx0cmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aG90OiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpLFxuIFx0XHRcdHBhcmVudHM6IChob3RDdXJyZW50UGFyZW50c1RlbXAgPSBob3RDdXJyZW50UGFyZW50cywgaG90Q3VycmVudFBhcmVudHMgPSBbXSwgaG90Q3VycmVudFBhcmVudHNUZW1wKSxcbiBcdFx0XHRjaGlsZHJlbjogW11cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkpO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZSgwKShfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcbiIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVwZGF0ZWRNb2R1bGVzLCByZW5ld2VkTW9kdWxlcykge1xuXHR2YXIgdW5hY2NlcHRlZE1vZHVsZXMgPSB1cGRhdGVkTW9kdWxlcy5maWx0ZXIoZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRyZXR1cm4gcmVuZXdlZE1vZHVsZXMgJiYgcmVuZXdlZE1vZHVsZXMuaW5kZXhPZihtb2R1bGVJZCkgPCAwO1xuXHR9KTtcblx0dmFyIGxvZyA9IHJlcXVpcmUoXCIuL2xvZ1wiKTtcblxuXHRpZiAodW5hY2NlcHRlZE1vZHVsZXMubGVuZ3RoID4gMCkge1xuXHRcdGxvZyhcblx0XHRcdFwid2FybmluZ1wiLFxuXHRcdFx0XCJbSE1SXSBUaGUgZm9sbG93aW5nIG1vZHVsZXMgY291bGRuJ3QgYmUgaG90IHVwZGF0ZWQ6IChUaGV5IHdvdWxkIG5lZWQgYSBmdWxsIHJlbG9hZCEpXCJcblx0XHQpO1xuXHRcdHVuYWNjZXB0ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHR9KTtcblx0fVxuXG5cdGlmICghcmVuZXdlZE1vZHVsZXMgfHwgcmVuZXdlZE1vZHVsZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdIE5vdGhpbmcgaG90IHVwZGF0ZWQuXCIpO1xuXHR9IGVsc2Uge1xuXHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSBVcGRhdGVkIG1vZHVsZXM6XCIpO1xuXHRcdHJlbmV3ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRcdGlmICh0eXBlb2YgbW9kdWxlSWQgPT09IFwic3RyaW5nXCIgJiYgbW9kdWxlSWQuaW5kZXhPZihcIiFcIikgIT09IC0xKSB7XG5cdFx0XHRcdHZhciBwYXJ0cyA9IG1vZHVsZUlkLnNwbGl0KFwiIVwiKTtcblx0XHRcdFx0bG9nLmdyb3VwQ29sbGFwc2VkKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgcGFydHMucG9wKCkpO1xuXHRcdFx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0XHRcdGxvZy5ncm91cEVuZChcImluZm9cIik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dmFyIG51bWJlcklkcyA9IHJlbmV3ZWRNb2R1bGVzLmV2ZXJ5KGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0XHRyZXR1cm4gdHlwZW9mIG1vZHVsZUlkID09PSBcIm51bWJlclwiO1xuXHRcdH0pO1xuXHRcdGlmIChudW1iZXJJZHMpXG5cdFx0XHRsb2coXG5cdFx0XHRcdFwiaW5mb1wiLFxuXHRcdFx0XHRcIltITVJdIENvbnNpZGVyIHVzaW5nIHRoZSBOYW1lZE1vZHVsZXNQbHVnaW4gZm9yIG1vZHVsZSBuYW1lcy5cIlxuXHRcdFx0KTtcblx0fVxufTtcbiIsInZhciBsb2dMZXZlbCA9IFwiaW5mb1wiO1xuXG5mdW5jdGlvbiBkdW1teSgpIHt9XG5cbmZ1bmN0aW9uIHNob3VsZExvZyhsZXZlbCkge1xuXHR2YXIgc2hvdWxkTG9nID1cblx0XHQobG9nTGV2ZWwgPT09IFwiaW5mb1wiICYmIGxldmVsID09PSBcImluZm9cIikgfHxcblx0XHQoW1wiaW5mb1wiLCBcIndhcm5pbmdcIl0uaW5kZXhPZihsb2dMZXZlbCkgPj0gMCAmJiBsZXZlbCA9PT0gXCJ3YXJuaW5nXCIpIHx8XG5cdFx0KFtcImluZm9cIiwgXCJ3YXJuaW5nXCIsIFwiZXJyb3JcIl0uaW5kZXhPZihsb2dMZXZlbCkgPj0gMCAmJiBsZXZlbCA9PT0gXCJlcnJvclwiKTtcblx0cmV0dXJuIHNob3VsZExvZztcbn1cblxuZnVuY3Rpb24gbG9nR3JvdXAobG9nRm4pIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGxldmVsLCBtc2cpIHtcblx0XHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdFx0bG9nRm4obXNnKTtcblx0XHR9XG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGV2ZWwsIG1zZykge1xuXHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdGlmIChsZXZlbCA9PT0gXCJpbmZvXCIpIHtcblx0XHRcdGNvbnNvbGUubG9nKG1zZyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA9PT0gXCJ3YXJuaW5nXCIpIHtcblx0XHRcdGNvbnNvbGUud2Fybihtc2cpO1xuXHRcdH0gZWxzZSBpZiAobGV2ZWwgPT09IFwiZXJyb3JcIikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihtc2cpO1xuXHRcdH1cblx0fVxufTtcblxuLyogZXNsaW50LWRpc2FibGUgbm9kZS9uby11bnN1cHBvcnRlZC1mZWF0dXJlcy9ub2RlLWJ1aWx0aW5zICovXG52YXIgZ3JvdXAgPSBjb25zb2xlLmdyb3VwIHx8IGR1bW15O1xudmFyIGdyb3VwQ29sbGFwc2VkID0gY29uc29sZS5ncm91cENvbGxhcHNlZCB8fCBkdW1teTtcbnZhciBncm91cEVuZCA9IGNvbnNvbGUuZ3JvdXBFbmQgfHwgZHVtbXk7XG4vKiBlc2xpbnQtZW5hYmxlIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGlucyAqL1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cCA9IGxvZ0dyb3VwKGdyb3VwKTtcblxubW9kdWxlLmV4cG9ydHMuZ3JvdXBDb2xsYXBzZWQgPSBsb2dHcm91cChncm91cENvbGxhcHNlZCk7XG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwRW5kID0gbG9nR3JvdXAoZ3JvdXBFbmQpO1xuXG5tb2R1bGUuZXhwb3J0cy5zZXRMb2dMZXZlbCA9IGZ1bmN0aW9uKGxldmVsKSB7XG5cdGxvZ0xldmVsID0gbGV2ZWw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5mb3JtYXRFcnJvciA9IGZ1bmN0aW9uKGVycikge1xuXHR2YXIgbWVzc2FnZSA9IGVyci5tZXNzYWdlO1xuXHR2YXIgc3RhY2sgPSBlcnIuc3RhY2s7XG5cdGlmICghc3RhY2spIHtcblx0XHRyZXR1cm4gbWVzc2FnZTtcblx0fSBlbHNlIGlmIChzdGFjay5pbmRleE9mKG1lc3NhZ2UpIDwgMCkge1xuXHRcdHJldHVybiBtZXNzYWdlICsgXCJcXG5cIiArIHN0YWNrO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBzdGFjaztcblx0fVxufTtcbiIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vKmdsb2JhbHMgX19yZXNvdXJjZVF1ZXJ5ICovXG5pZiAobW9kdWxlLmhvdCkge1xuXHR2YXIgaG90UG9sbEludGVydmFsID0gK19fcmVzb3VyY2VRdWVyeS5zdWJzdHIoMSkgfHwgMTAgKiA2MCAqIDEwMDA7XG5cdHZhciBsb2cgPSByZXF1aXJlKFwiLi9sb2dcIik7XG5cblx0dmFyIGNoZWNrRm9yVXBkYXRlID0gZnVuY3Rpb24gY2hlY2tGb3JVcGRhdGUoZnJvbVVwZGF0ZSkge1xuXHRcdGlmIChtb2R1bGUuaG90LnN0YXR1cygpID09PSBcImlkbGVcIikge1xuXHRcdFx0bW9kdWxlLmhvdFxuXHRcdFx0XHQuY2hlY2sodHJ1ZSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24odXBkYXRlZE1vZHVsZXMpIHtcblx0XHRcdFx0XHRpZiAoIXVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0XHRcdFx0XHRpZiAoZnJvbVVwZGF0ZSkgbG9nKFwiaW5mb1wiLCBcIltITVJdIFVwZGF0ZSBhcHBsaWVkLlwiKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVxdWlyZShcIi4vbG9nLWFwcGx5LXJlc3VsdFwiKSh1cGRhdGVkTW9kdWxlcywgdXBkYXRlZE1vZHVsZXMpO1xuXHRcdFx0XHRcdGNoZWNrRm9yVXBkYXRlKHRydWUpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG5cdFx0XHRcdFx0dmFyIHN0YXR1cyA9IG1vZHVsZS5ob3Quc3RhdHVzKCk7XG5cdFx0XHRcdFx0aWYgKFtcImFib3J0XCIsIFwiZmFpbFwiXS5pbmRleE9mKHN0YXR1cykgPj0gMCkge1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIENhbm5vdCBhcHBseSB1cGRhdGUuXCIpO1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFwiICsgbG9nLmZvcm1hdEVycm9yKGVycikpO1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFlvdSBuZWVkIHRvIHJlc3RhcnQgdGhlIGFwcGxpY2F0aW9uIVwiKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFVwZGF0ZSBmYWlsZWQ6IFwiICsgbG9nLmZvcm1hdEVycm9yKGVycikpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXHRzZXRJbnRlcnZhbChjaGVja0ZvclVwZGF0ZSwgaG90UG9sbEludGVydmFsKTtcbn0gZWxzZSB7XG5cdHRocm93IG5ldyBFcnJvcihcIltITVJdIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnQgaXMgZGlzYWJsZWQuXCIpO1xufVxuIiwiaW1wb3J0IFwicmVmbGVjdC1tZXRhZGF0YVwiO1xyXG5pbXBvcnQgeyBHcmFwaFFMU2VydmVyIH0gZnJvbSBcImdyYXBocWwteW9nYVwiO1xyXG5pbXBvcnQgeyBidWlsZFNjaGVtYSB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcclxuaW1wb3J0IHsgR2FtZURldGFpbHNSZXNvbHZlciB9IGZyb20gJy4vcmVzb2x2ZXJzL0dhbWVEZXRhaWxSZXNvbHZlcic7XHJcbmltcG9ydCBBZ2dHYW1lU3RhdFJlc29sdmVyIGZyb20gXCIuL3Jlc29sdmVycy9BZ2dHYW1lU3RhdFJlc29sdmVyXCI7XHJcbmltcG9ydCBQbGF5ZXJSZXNvbHZlciBmcm9tIFwiLi9yZXNvbHZlcnMvUGxheWVyUmVzb2x2ZXJcIjtcclxuaW1wb3J0IEdhbWVSZXNvbHZlciBmcm9tICcuL3Jlc29sdmVycy9HYW1lUmVzb2x2ZXInO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbmltcG9ydCBuZmxHYW1lIGZyb20gJy4vbmZsZ2FtZS9uZmxnYW1lJztcclxuXHJcbm5mbEdhbWUuZ2V0SW5zdGFuY2UocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL2RhdGEvJykpO1xyXG5cclxuLy8gLy8gR1JBUEhRTCBQT1JUSU9OXHJcbmFzeW5jIGZ1bmN0aW9uIGJvb3RzdHJhcCgpIHtcclxuXHJcbiAgICBjb25zdCBzY2hlbWEgPSBhd2FpdCBidWlsZFNjaGVtYSh7XHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgICAgIEdhbWVEZXRhaWxzUmVzb2x2ZXIsXHJcbiAgICAgICAgICAgIEFnZ0dhbWVTdGF0UmVzb2x2ZXIsXHJcbiAgICAgICAgICAgIFBsYXllclJlc29sdmVyLFxyXG4gICAgICAgICAgICBHYW1lUmVzb2x2ZXJcclxuICAgICAgICBdLFxyXG4gICAgICAgIHZhbGlkYXRlOiBmYWxzZSxcclxuICAgICAgICBlbWl0U2NoZW1hRmlsZTogdHJ1ZSxcclxuICAgIH0pO1xyXG5cclxuXHJcblxyXG4gICAgY29uc3Qgc2VydmVyID0gbmV3IEdyYXBoUUxTZXJ2ZXIoe1xyXG4gICAgICAgIHNjaGVtYSxcclxuICAgIH0pO1xyXG5cclxuICAgIHNlcnZlci5zdGFydCgoKSA9PiBjb25zb2xlLmxvZyhcIlNlcnZlciBpcyBydW5uaW5nIG9uIGh0dHA6Ly9sb2NhbGhvc3Q6NDAwMFwiKSk7XHJcblxyXG59XHJcblxyXG5ib290c3RyYXAoKTtcclxuXHJcbi8vIG5mbEdhbWUuZ2V0SW5zdGFuY2UoKS5zZWFyY2hTY2hlZHVsZSh7aG9tZTogJ05ZRycsIHllYXI6IDIwMTF9KS50aGVuKChyZXN1bHQpID0+IHtcclxuLy8gICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XHJcbi8vIH0pXHJcblxyXG5cclxuLy8gSFJNXHJcbi8vIGlmIChtb2R1bGUuaG90KSB7XHJcbi8vICAgICBtb2R1bGUuaG90LmFjY2VwdCgpO1xyXG4vLyAgICAgbW9kdWxlLmhvdC5kaXNwb3NlKCgpID0+IGNvbnNvbGUubG9nKCdNb2R1bGUgZGlzcG9zZWQuICcpKTtcclxuLy8gfVxyXG5cclxuXHJcbi8vIGNsYXNzIE5mbGdhbWUge1xyXG4vLyAgICAgdGVhbXMgPSBbXHJcbi8vICAgICAgICAgWydBUkknLCAnQXJpem9uYScsICdDYXJkaW5hbHMnLCAnQXJpem9uYSBDYXJkaW5hbHMnXSxcclxuLy8gICAgICAgICBbJ0FUTCcsICdBdGxhbnRhJywgJ0ZhbGNvbnMnLCAnQXRsYW50YSBGYWxjb25zJ10sXHJcbi8vICAgICAgICAgWydCQUwnLCAnQmFsdGltb3JlJywgJ1JhdmVucycsICdCYWx0aW1vcmUgUmF2ZW5zJ10sXHJcbi8vICAgICAgICAgWydCVUYnLCAnQnVmZmFsbycsICdCaWxscycsICdCdWZmYWxvIEJpbGxzJ10sXHJcbi8vICAgICAgICAgWydDQVInLCAnQ2Fyb2xpbmEnLCAnUGFudGhlcnMnLCAnQ2Fyb2xpbmEgUGFudGhlcnMnXSxcclxuLy8gICAgICAgICBbJ0NISScsICdDaGljYWdvJywgJ0JlYXJzJywgJ0NoaWNhZ28gQmVhcnMnXSxcclxuLy8gICAgICAgICBbJ0NJTicsICdDaW5jaW5uYXRpJywgJ0JlbmdhbHMnLCAnQ2luY2lubmF0aSBCZW5nYWxzJ10sXHJcbi8vICAgICAgICAgWydDTEUnLCAnQ2xldmVsYW5kJywgJ0Jyb3ducycsICdDbGV2ZWxhbmQgQnJvd25zJ10sXHJcbi8vICAgICAgICAgWydEQUwnLCAnRGFsbGFzJywgJ0Nvd2JveXMnLCAnRGFsbGFzIENvd2JveXMnXSxcclxuLy8gICAgICAgICBbJ0RFTicsICdEZW52ZXInLCAnQnJvbmNvcycsICdEZW52ZXIgQnJvbmNvcyddLFxyXG4vLyAgICAgICAgIFsnREVUJywgJ0RldHJvaXQnLCAnTGlvbnMnLCAnRGV0cm9pdCBMaW9ucyddLFxyXG4vLyAgICAgICAgIFsnR0InLCAnR3JlZW4gQmF5JywgJ1BhY2tlcnMnLCAnR3JlZW4gQmF5IFBhY2tlcnMnLCAnR05CJ10sXHJcbi8vICAgICAgICAgWydIT1UnLCAnSG91c3RvbicsICdUZXhhbnMnLCAnSG91c3RvbiBUZXhhbnMnXSxcclxuLy8gICAgICAgICBbJ0lORCcsICdJbmRpYW5hcG9saXMnLCAnQ29sdHMnLCAnSW5kaWFuYXBvbGlzIENvbHRzJ10sXHJcbi8vICAgICAgICAgWydKQUMnLCAnSmFja3NvbnZpbGxlJywgJ0phZ3VhcnMnLCAnSmFja3NvbnZpbGxlIEphZ3VhcnMnLCAnSkFYJ10sXHJcbi8vICAgICAgICAgWydLQycsICdLYW5zYXMgQ2l0eScsICdDaGllZnMnLCAnS2Fuc2FzIENpdHkgQ2hpZWZzJywgJ0tBTiddLFxyXG4vLyAgICAgICAgIFsnTEEnLCAnTG9zIEFuZ2VsZXMnLCAnUmFtcycsICdMb3MgQW5nZWxlcyBSYW1zJywgJ0xBUiddLFxyXG4vLyAgICAgICAgIFsnU0QnLCAnU2FuIERpZWdvJywgJ0NoYXJnZXJzJywgJ1NhbiBEaWVnbyBDaGFyZ2VycycsICdTREcnXSxcclxuLy8gICAgICAgICBbJ0xBQycsICdMb3MgQW5nZWxlcyBDJywgJ0NoYXJnZXJzJywgJ0xvcyBBbmdlbGVzIENoYXJnZXJzJywgJ0xBQyddLFxyXG4vLyAgICAgICAgIFsnTUlBJywgJ01pYW1pJywgJ0RvbHBoaW5zJywgJ01pYW1pIERvbHBoaW5zJ10sXHJcbi8vICAgICAgICAgWydNSU4nLCAnTWlubmVzb3RhJywgJ1Zpa2luZ3MnLCAnTWlubmVzb3RhIFZpa2luZ3MnXSxcclxuLy8gICAgICAgICBbJ05FJywgJ05ldyBFbmdsYW5kJywgJ1BhdHJpb3RzJywgJ05ldyBFbmdsYW5kIFBhdHJpb3RzJywgJ05XRSddLFxyXG4vLyAgICAgICAgIFsnTk8nLCAnTmV3IE9ybGVhbnMnLCAnU2FpbnRzJywgJ05ldyBPcmxlYW5zIFNhaW50cycsICdOT1InXSxcclxuLy8gICAgICAgICBbJ05ZRycsICdOZXcgWW9yayBHJywgJ0dpYW50cycsICdOZXcgWW9yayBHaWFudHMnXSxcclxuLy8gICAgICAgICBbJ05ZSicsICdOZXcgWW9yayBKJywgJ0pldHMnLCAnTmV3IFlvcmsgSmV0cyddLFxyXG4vLyAgICAgICAgIFsnT0FLJywgJ09ha2xhbmQnLCAnUmFpZGVycycsICdPYWtsYW5kIFJhaWRlcnMnXSxcclxuLy8gICAgICAgICBbJ1BISScsICdQaGlsYWRlbHBoaWEnLCAnRWFnbGVzJywgJ1BoaWxhZGVscGhpYSBFYWdsZXMnXSxcclxuLy8gICAgICAgICBbJ1BJVCcsICdQaXR0c2J1cmdoJywgJ1N0ZWVsZXJzJywgJ1BpdHRzYnVyZ2ggU3RlZWxlcnMnXSxcclxuLy8gICAgICAgICBbJ1NFQScsICdTZWF0dGxlJywgJ1NlYWhhd2tzJywgJ1NlYXR0bGUgU2VhaGF3a3MnXSxcclxuLy8gICAgICAgICBbJ1NGJywgJ1NhbiBGcmFuY2lzY28nLCAnNDllcnMnLCAnU2FuIEZyYW5jaXNjbyA0OWVycycsICdTRk8nXSxcclxuLy8gICAgICAgICBbJ1NUTCcsICdTdC4gTG91aXMnLCAnUmFtcycsICdTdC4gTG91aXMgUmFtcyddLFxyXG4vLyAgICAgICAgIFsnVEInLCAnVGFtcGEgQmF5JywgJ0J1Y2NhbmVlcnMnLCAnVGFtcGEgQmF5IEJ1Y2NhbmVlcnMnLCAnVEFNJ10sXHJcbi8vICAgICAgICAgWydURU4nLCAnVGVubmVzc2VlJywgJ1RpdGFucycsICdUZW5uZXNzZWUgVGl0YW5zJ10sXHJcbi8vICAgICAgICAgWydXQVMnLCAnV2FzaGluZ3RvbicsICdSZWRza2lucycsICdXYXNoaW5ndG9uIFJlZHNraW5zJywgJ1dTSCddLFxyXG4vLyAgICAgXVxyXG4vLyB9XHJcblxyXG4iLCJpbXBvcnQgeyBuZmxBcGlHYW1lLCBuZmxBZ2dHYW1lU3RhdHMgfSBmcm9tIFwiLi4vc2NoZW1hcy9uZmxBcGlHYW1lXCI7XHJcbmltcG9ydCB7IEFnZ0dhbWVTdGF0IH0gZnJvbSBcIi4uL3NjaGVtYXMvQWdnR2FtZVN0YXRcIjtcclxuaW1wb3J0IEdhbWVEZXRhaWxzIGZyb20gXCIuLi9zY2hlbWFzL0dhbWVcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGF5ZXJTdGF0cyhuZmxHYW1lOiBuZmxBcGlHYW1lIHwgbnVsbCkge1xyXG4gICAgaWYgKG5mbEdhbWUgPT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBbXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBob21lID0gbmZsR2FtZS5ob21lLnN0YXRzXHJcbiAgICAgICAgY29uc3QgYXdheSA9IG5mbEdhbWUuYXdheS5zdGF0c1xyXG4gICAgICAgIHJldHVybiBmbGF0dGVuU3RhdHMoaG9tZSkuY29uY2F0KGZsYXR0ZW5TdGF0cyhhd2F5KSlcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZmxhdHRlblN0YXRzKHN0YXRzOiBuZmxBZ2dHYW1lU3RhdHMpIHtcclxuICAgIC8vIHZlcmJvc2UsIGJ1dCBjbGVhcmVyLiBTaG91bGQgcmVmYWN0b3JcclxuXHJcbiAgICBjb25zdCBwbGF5ZXJTdGF0czogQWdnR2FtZVN0YXRbXSA9IFtdXHJcblxyXG4gICAgaWYgKHN0YXRzLnBhc3NpbmcpIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhzdGF0cy5wYXNzaW5nKS5mb3JFYWNoKChwbGF5ZXJJZCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ID0ge1xyXG4gICAgICAgICAgICAgICAgcGxheWVySWQ6IHBsYXllcklkLFxyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6ICdwYXNzaW5nJyxcclxuICAgICAgICAgICAgICAgIG5hbWU6IHN0YXRzLnBhc3NpbmdbcGxheWVySWRdLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBwYXNzaW5nX2F0dDogc3RhdHMucGFzc2luZ1twbGF5ZXJJZF0uYXR0LFxyXG4gICAgICAgICAgICAgICAgcGFzc2luZ19jbXA6IHN0YXRzLnBhc3NpbmdbcGxheWVySWRdLmNtcCxcclxuICAgICAgICAgICAgICAgIHBhc3NpbmdfeWRzOiBzdGF0cy5wYXNzaW5nW3BsYXllcklkXS55ZHMsXHJcbiAgICAgICAgICAgICAgICBwYXNzaW5nX3Rkczogc3RhdHMucGFzc2luZ1twbGF5ZXJJZF0udGRzLFxyXG4gICAgICAgICAgICAgICAgcGFzc2luZ19pbnRzOiBzdGF0cy5wYXNzaW5nW3BsYXllcklkXS5pbnRzLFxyXG4gICAgICAgICAgICAgICAgcGFzc2luZ190d29wdGE6IHN0YXRzLnBhc3NpbmdbcGxheWVySWRdLnR3b3B0YSxcclxuICAgICAgICAgICAgICAgIHBhc3NpbmdfdHdvcHRtOiBzdGF0cy5wYXNzaW5nW3BsYXllcklkXS50d29wdG0sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGxheWVyU3RhdHMucHVzaChzdGF0KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3RhdHMucnVzaGluZykge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHN0YXRzLnJ1c2hpbmcpLmZvckVhY2goKHBsYXllcklkKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXQgPSB7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJJZDogcGxheWVySWQsXHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogJ3J1c2hpbmcnLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogc3RhdHMucnVzaGluZ1twbGF5ZXJJZF0ubmFtZSxcclxuICAgICAgICAgICAgICAgIHJ1c2hpbmdfYXR0OiBzdGF0cy5ydXNoaW5nW3BsYXllcklkXS5hdHQsXHJcbiAgICAgICAgICAgICAgICBydXNoaW5nX3lkczogc3RhdHMucnVzaGluZ1twbGF5ZXJJZF0ueWRzLFxyXG4gICAgICAgICAgICAgICAgcnVzaGluZ190ZHM6IHN0YXRzLnJ1c2hpbmdbcGxheWVySWRdLnRkcyxcclxuICAgICAgICAgICAgICAgIHJ1c2hpbmdfbG5nOiBzdGF0cy5ydXNoaW5nW3BsYXllcklkXS5sbmcsXHJcbiAgICAgICAgICAgICAgICBydXNoaW5nX2xuZ3RkOiBzdGF0cy5ydXNoaW5nW3BsYXllcklkXS5sbmd0ZCxcclxuICAgICAgICAgICAgICAgIHJ1c2hpbmdfdHdvcHRhOiBzdGF0cy5ydXNoaW5nW3BsYXllcklkXS50d29wdGEsXHJcbiAgICAgICAgICAgICAgICBydXNoaW5nX3R3b3B0bTogc3RhdHMucnVzaGluZ1twbGF5ZXJJZF0udHdvcHRtLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBsYXllclN0YXRzLnB1c2goc3RhdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN0YXRzLnJlY2VpdmluZykge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHN0YXRzLnJlY2VpdmluZykuZm9yRWFjaCgocGxheWVySWQpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdCA9IHtcclxuICAgICAgICAgICAgICAgIHBsYXllcklkOiBwbGF5ZXJJZCxcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5OiAncmVjZWl2aW5nJyxcclxuICAgICAgICAgICAgICAgIG5hbWU6IHN0YXRzLnJlY2VpdmluZ1twbGF5ZXJJZF0ubmFtZSxcclxuICAgICAgICAgICAgICAgIHJlY2VpdmluZ19yZWM6IHN0YXRzLnJlY2VpdmluZ1twbGF5ZXJJZF0ucmVjLFxyXG4gICAgICAgICAgICAgICAgcmVjZWl2aW5nX3lkczogc3RhdHMucmVjZWl2aW5nW3BsYXllcklkXS55ZHMsXHJcbiAgICAgICAgICAgICAgICByZWNlaXZpbmdfdGRzOiBzdGF0cy5yZWNlaXZpbmdbcGxheWVySWRdLnRkcyxcclxuICAgICAgICAgICAgICAgIHJlY2VpdmluZ19sbmc6IHN0YXRzLnJlY2VpdmluZ1twbGF5ZXJJZF0ubG5nLFxyXG4gICAgICAgICAgICAgICAgcmVjZWl2aW5nX2xuZ3RkOiBzdGF0cy5yZWNlaXZpbmdbcGxheWVySWRdLmxuZ3RkLFxyXG4gICAgICAgICAgICAgICAgcmVjZWl2aW5nX3R3b3B0YTogc3RhdHMucmVjZWl2aW5nW3BsYXllcklkXS50d29wdGEsXHJcbiAgICAgICAgICAgICAgICByZWNlaXZpbmdfdHdvcHRtOiBzdGF0cy5yZWNlaXZpbmdbcGxheWVySWRdLnR3b3B0bSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwbGF5ZXJTdGF0cy5wdXNoKHN0YXQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3RhdHMuZnVtYmxlcykge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHN0YXRzLmZ1bWJsZXMpLmZvckVhY2goKHBsYXllcklkKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXQgPSB7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJJZDogcGxheWVySWQsXHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogJ2Z1bWJsZXMnLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogc3RhdHMuZnVtYmxlc1twbGF5ZXJJZF0ubmFtZSxcclxuICAgICAgICAgICAgICAgIGZ1bWJsZXNfZm9yY2VkOiBzdGF0cy5mdW1ibGVzW3BsYXllcklkXS5mb3JjZWQsXHJcbiAgICAgICAgICAgICAgICBmdW1ibGVzX2xvc3Q6IHN0YXRzLmZ1bWJsZXNbcGxheWVySWRdLmxvc3QsXHJcbiAgICAgICAgICAgICAgICBmdW1ibGVzX25vdGZvcmNlZDogc3RhdHMuZnVtYmxlc1twbGF5ZXJJZF0ubm90Zm9yY2VkLFxyXG4gICAgICAgICAgICAgICAgZnVtYmxlc19vb2I6IHN0YXRzLmZ1bWJsZXNbcGxheWVySWRdLm9vYixcclxuICAgICAgICAgICAgICAgIGZ1bWJsZXNfcmVjOiBzdGF0cy5mdW1ibGVzW3BsYXllcklkXS5yZWMsXHJcbiAgICAgICAgICAgICAgICBmdW1ibGVzX3JlY195ZHM6IHN0YXRzLmZ1bWJsZXNbcGxheWVySWRdLnJlY195ZHMsXHJcbiAgICAgICAgICAgICAgICBmdW1ibGVzX3RvdDogc3RhdHMuZnVtYmxlc1twbGF5ZXJJZF0udG90LFxyXG4gICAgICAgICAgICAgICAgZnVtYmxlc19yZWNfdGRzOiBzdGF0cy5mdW1ibGVzW3BsYXllcklkXS5yZWNfdGRzLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBsYXllclN0YXRzLnB1c2goc3RhdCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGlmIChzdGF0cy5raWNraW5nKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoc3RhdHMua2lja2luZykuZm9yRWFjaCgocGxheWVySWQpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdCA9IHtcclxuICAgICAgICAgICAgICAgIHBsYXllcklkOiBwbGF5ZXJJZCxcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5OiAna2lja2luZycsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBzdGF0cy5raWNraW5nW3BsYXllcklkXS5uYW1lLFxyXG4gICAgICAgICAgICAgICAga2lja2luZ19mZ206IHN0YXRzLmtpY2tpbmdbcGxheWVySWRdLmZnbSxcclxuICAgICAgICAgICAgICAgIGtpY2tpbmdfZmdhOiBzdGF0cy5raWNraW5nW3BsYXllcklkXS5mZ2EsXHJcbiAgICAgICAgICAgICAgICBraWNraW5nX2ZneWRzOiBzdGF0cy5raWNraW5nW3BsYXllcklkXS5mZ3lkcyxcclxuICAgICAgICAgICAgICAgIGtpY2tpbmdfdG90cGZnOiBzdGF0cy5raWNraW5nW3BsYXllcklkXS50b3RwZmcsXHJcbiAgICAgICAgICAgICAgICBraWNraW5nX3hwbWFkZTogc3RhdHMua2lja2luZ1twbGF5ZXJJZF0ueHBtYWRlLFxyXG4gICAgICAgICAgICAgICAga2lja2luZ194cGE6IHN0YXRzLmtpY2tpbmdbcGxheWVySWRdLnhwYSxcclxuICAgICAgICAgICAgICAgIGtpY2tpbmdfeHBiOiBzdGF0cy5raWNraW5nW3BsYXllcklkXS54cGIsXHJcbiAgICAgICAgICAgICAgICBraWNraW5nX3hwdG90OiBzdGF0cy5raWNraW5nW3BsYXllcklkXS54cHRvdCxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwbGF5ZXJTdGF0cy5wdXNoKHN0YXQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzdGF0cy5wdW50aW5nKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoc3RhdHMucHVudGluZykuZm9yRWFjaCgocGxheWVySWQpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdCA9IHtcclxuICAgICAgICAgICAgICAgIHBsYXllcklkOiBwbGF5ZXJJZCxcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5OiAncHVudGluZycsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBzdGF0cy5wdW50aW5nW3BsYXllcklkXS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgcHVudGluZ19wdHM6IHN0YXRzLnB1bnRpbmdbcGxheWVySWRdLnB0cyxcclxuICAgICAgICAgICAgICAgIHB1bnRpbmdfeWRzOiBzdGF0cy5wdW50aW5nW3BsYXllcklkXS55ZHMsXHJcbiAgICAgICAgICAgICAgICBwdW50aW5nX2F2Zzogc3RhdHMucHVudGluZ1twbGF5ZXJJZF0uYXZnLFxyXG4gICAgICAgICAgICAgICAgcHVudGluZ19pMjA6IHN0YXRzLnB1bnRpbmdbcGxheWVySWRdLmkyMCxcclxuICAgICAgICAgICAgICAgIHB1bnRpbmdfbG5nOiBzdGF0cy5wdW50aW5nW3BsYXllcklkXS5sbmdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwbGF5ZXJTdGF0cy5wdXNoKHN0YXQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzdGF0cy5raWNrcmV0KSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoc3RhdHMua2lja3JldCkuZm9yRWFjaCgocGxheWVySWQpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdCA9IHtcclxuICAgICAgICAgICAgICAgIHBsYXllcklkOiBwbGF5ZXJJZCxcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5OiAna2lja3JldCcsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBzdGF0cy5raWNrcmV0W3BsYXllcklkXS5uYW1lLFxyXG4gICAgICAgICAgICAgICAga2lja3JldF9yZXQ6IHN0YXRzLmtpY2tyZXRbcGxheWVySWRdLnJldCxcclxuICAgICAgICAgICAgICAgIGtpY2tyZXRfYXZnOiBzdGF0cy5raWNrcmV0W3BsYXllcklkXS5hdmcsXHJcbiAgICAgICAgICAgICAgICBraWNrcmV0X3Rkczogc3RhdHMua2lja3JldFtwbGF5ZXJJZF0udGRzLFxyXG4gICAgICAgICAgICAgICAga2lja3JldF9sbmc6IHN0YXRzLmtpY2tyZXRbcGxheWVySWRdLmxuZyxcclxuICAgICAgICAgICAgICAgIGtpY2tyZXRfbG5ndGQ6IHN0YXRzLmtpY2tyZXRbcGxheWVySWRdLmxuZ3RkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGxheWVyU3RhdHMucHVzaChzdGF0KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3RhdHMucHVudHJldCkge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHN0YXRzLnB1bnRyZXQpLmZvckVhY2goKHBsYXllcklkKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXQgPSB7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJJZDogcGxheWVySWQsXHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogJ3B1bnRyZXQnLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogc3RhdHMucHVudHJldFtwbGF5ZXJJZF0ubmFtZSxcclxuICAgICAgICAgICAgICAgIHB1bnRyZXRfcmV0OiBzdGF0cy5wdW50cmV0W3BsYXllcklkXS5yZXQsXHJcbiAgICAgICAgICAgICAgICBwdW50cmV0X2F2Zzogc3RhdHMucHVudHJldFtwbGF5ZXJJZF0uYXZnLFxyXG4gICAgICAgICAgICAgICAgcHVudHJldF90ZHM6IHN0YXRzLnB1bnRyZXRbcGxheWVySWRdLnRkcyxcclxuICAgICAgICAgICAgICAgIHB1bnRyZXRfbG5nOiBzdGF0cy5wdW50cmV0W3BsYXllcklkXS5sbmcsXHJcbiAgICAgICAgICAgICAgICBwdW50cmV0X2xuZ3RkOiBzdGF0cy5wdW50cmV0W3BsYXllcklkXS5sbmd0ZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBsYXllclN0YXRzLnB1c2goc3RhdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN0YXRzLmRlZmVuc2UpIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhzdGF0cy5kZWZlbnNlKS5mb3JFYWNoKChwbGF5ZXJJZCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ID0ge1xyXG4gICAgICAgICAgICAgICAgcGxheWVySWQ6IHBsYXllcklkLFxyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6ICdkZWZlbnNlJyxcclxuICAgICAgICAgICAgICAgIG5hbWU6IHN0YXRzLmRlZmVuc2VbcGxheWVySWRdLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBkZWZlbnNlX3RrbDogc3RhdHMuZGVmZW5zZVtwbGF5ZXJJZF0udGtsLFxyXG4gICAgICAgICAgICAgICAgZGVmZW5zZV9hc3Q6IHN0YXRzLmRlZmVuc2VbcGxheWVySWRdLmFzdCxcclxuICAgICAgICAgICAgICAgIGRlZmVuc2Vfc2s6IHN0YXRzLmRlZmVuc2VbcGxheWVySWRdLnNrLFxyXG4gICAgICAgICAgICAgICAgZGVmZW5zZV9pbnQ6IHN0YXRzLmRlZmVuc2VbcGxheWVySWRdLmludCxcclxuICAgICAgICAgICAgICAgIGRlZmVuc2VfZmZ1bTogc3RhdHMuZGVmZW5zZVtwbGF5ZXJJZF0uZmZ1bVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBsYXllclN0YXRzLnB1c2goc3RhdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJldHVybiBwbGF5ZXJTdGF0cztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlR2FtZShnOiBuZmxBcGlHYW1lKTogR2FtZURldGFpbHMge1xyXG4gICAgY29uc3QgZ2FtZTogR2FtZURldGFpbHMgPSB7XHJcbiAgICAgICAgd2VhdGhlcjogZy53ZWF0aGVyID8gZy53ZWF0aGVyIDogJycsXHJcbiAgICAgICAgbWVkaWE6IGcubWVkaWEgPyBnLm1lZGlhIDogJycsXHJcbiAgICAgICAgeWw6IGcueWwsXHJcbiAgICAgICAgcXRyOiBnLnF0cixcclxuICAgICAgICBub3RlOiBnLm5vdGUgPyBnLm5vdGUgOiAnJyxcclxuICAgICAgICBkb3duOiBnLmRvd24sXHJcbiAgICAgICAgdG9nbzogZy50b2dvLFxyXG4gICAgICAgIHJlZHpvbmU6IGcucmVkem9uZSxcclxuICAgICAgICBjbG9jazogZy5jbG9jayxcclxuICAgICAgICBwb3N0ZWFtOiBnLnBvc3RlYW0sXHJcbiAgICAgICAgc3RhZGl1bTogZy5zdGFkaXVtID8gZy5zdGFkaXVtIDogJycsXHJcbiAgICAgICAgaG9tZVNob3J0OiBnLmhvbWUuYWJicixcclxuICAgICAgICBhd2F5U2hvcnQ6IGcuYXdheS5hYmJyXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGdhbWU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnYW1lc0dlbih5ZWFyOiBudW1iZXIsIHdlZWs/OiBudW1iZXIsIGhvbWU/OiBzdHJpbmcsIGF3YXk/OiBzdHJpbmcsIGtpbmQgPSAnUkVHJywgc3RhcnRlZCA9IGZhbHNlKSB7XHJcbiAgICAvKlxyXG4gICAgZ2FtZXMgcmV0dXJucyBhIGdlbmVyYXRvciBvZiBhbGwgZ2FtZXMgbWF0Y2hpbmcgdGhlIGdpdmVuIGNyaXRlcmlhLiBFYWNoXHJcbiAgICBnYW1lIGNhbiB0aGVuIGJlIHF1ZXJpZWQgZm9yIHBsYXllciBzdGF0aXN0aWNzIGFuZCBpbmZvcm1hdGlvbiBhYm91dFxyXG4gICAgdGhlIGdhbWUgaXRzZWxmIChzY29yZSwgd2lubmVyLCBzY29yaW5nIHBsYXlzLCBldGMuKS5cclxuXHJcbiAgICBBcyBhIHNwZWNpYWwgY2FzZSwgaWYgdGhlIGhvbWUgYW5kIGF3YXkgdGVhbXMgYXJlIHNldCB0byB0aGUgc2FtZSB0ZWFtLFxyXG4gICAgdGhlbiBhbGwgZ2FtZXMgd2hlcmUgdGhhdCB0ZWFtIHBsYXllZCBhcmUgcmV0dXJuZWQuXHJcblxyXG4gICAgVGhlIGtpbmQgcGFyYW1ldGVyIHNwZWNpZmllcyB3aGV0aGVyIHRvIGZldGNoIHByZXNlYXNvbiwgcmVndWxhciBzZWFzb25cclxuICAgIG9yIHBvc3RzZWFzb24gZ2FtZXMuIFZhbGlkIHZhbHVlcyBhcmUgUFJFLCBSRUcgYW5kIFBPU1QuXHJcblxyXG4gICAgVGhlIHdlZWsgcGFyYW1ldGVyIGlzIHJlbGF0aXZlIHRvIHRoZSB2YWx1ZSBvZiB0aGUga2luZCBwYXJhbWV0ZXIsIGFuZFxyXG4gICAgbWF5IGJlIHNldCB0byBhIGxpc3Qgb2Ygd2VlayBudW1iZXJzLlxyXG5cclxuICAgIEluIHRoZSByZWd1bGFyIHNlYXNvbiwgdGhlIHdlZWsgcGFyYW1ldGVyIGNvcnJlc3BvbmRzIHRvIHRoZSBub3JtYWxcclxuICAgIHdlZWsgbnVtYmVycyAxIHRocm91Z2ggMTcuIFNpbWlsYXJseSBpbiB0aGUgcHJlc2Vhc29uLCB2YWxpZCB3ZWVrIG51bWJlcnNcclxuICAgIGFyZSAxIHRocm91Z2ggNC4gSW4gdGhlIHBvc3Qgc2Vhc29uLCB0aGUgd2VlayBudW1iZXIgY29ycmVzcG9uZHMgdG8gdGhlXHJcbiAgICBudW1lcmljYWwgcm91bmQgb2YgdGhlIHBsYXlvZmZzLiBTbyB0aGUgd2lsZCBjYXJkIHJvdW5kIGlzIHdlZWsgMSxcclxuICAgIHRoZSBkaXZpc2lvbmFsIHJvdW5kIGlzIHdlZWsgMiwgdGhlIGNvbmZlcmVuY2Ugcm91bmQgaXMgd2VlayAzXHJcbiAgICBhbmQgdGhlIFN1cGVyIEJvd2wgaXMgd2VlayA0LlxyXG5cclxuICAgIFRoZSB5ZWFyIHBhcmFtZXRlciBzcGVjaWZpZXMgdGhlIHNlYXNvbiwgYW5kIG5vdCBuZWNlc3NhcmlseSB0aGUgYWN0dWFsXHJcbiAgICB5ZWFyIHRoYXQgYSBnYW1lIHdhcyBwbGF5ZWQgaW4uIEZvciBleGFtcGxlLCBhIFN1cGVyIEJvd2wgdGFraW5nIHBsYWNlXHJcbiAgICBpbiB0aGUgeWVhciAyMDExIGFjdHVhbGx5IGJlbG9uZ3MgdG8gdGhlIDIwMTAgc2Vhc29uLiBBbHNvLCB0aGUgeWVhclxyXG4gICAgcGFyYW1ldGVyIG1heSBiZSBzZXQgdG8gYSBsaXN0IG9mIHNlYXNvbnMganVzdCBsaWtlIHRoZSB3ZWVrIHBhcmFtZXRlci5cclxuICAgIE5vdGUgdGhhdCBpZiBhIGdhbWUncyBKU09OIGRhdGEgaXMgbm90IGNhY2hlZCB0byBkaXNrLCBpdCBpcyByZXRyaWV2ZWRcclxuICAgIGZyb20gdGhlIE5GTCB3ZWIgc2l0ZS4gQSBnYW1lJ3MgSlNPTiBkYXRhIGlzICpvbmx5KiBjYWNoZWQgdG8gZGlzayBvbmNlXHJcbiAgICB0aGUgZ2FtZSBpcyBvdmVyLCBzbyBiZSBjYXJlZnVsIHdpdGggdGhlIG51bWJlciBvZiB0aW1lcyB5b3UgY2FsbCB0aGlzXHJcbiAgICB3aGlsZSBhIGdhbWUgaXMgZ29pbmcgb24uIChpLmUuLCBkb24ndCBwaXNzIG9mZiBORkwuY29tLilcclxuXHJcbiAgICBJZiBzdGFydGVkIGlzIFRydWUsIHRoZW4gb25seSBnYW1lcyB0aGF0IGhhdmUgYWxyZWFkeSBzdGFydGVkIChvciBhcmVcclxuICAgIGFib3V0IHRvIHN0YXJ0IGluIGxlc3MgdGhhbiA1IG1pbnV0ZXMpIHdpbGwgYmUgcmV0dXJuZWQuIE5vdGUgdGhhdCB0aGVcclxuICAgIHN0YXJ0ZWQgcGFyYW1ldGVyIHJlcXVpcmVzIHB5dHogdG8gYmUgaW5zdGFsbGVkLiBUaGlzIGlzIHVzZWZ1bCB3aGVuXHJcbiAgICB5b3Ugb25seSB3YW50IHRvIGNvbGxlY3Qgc3RhdHMgZnJvbSBnYW1lcyB0aGF0IGhhdmUgSlNPTiBkYXRhIGF2YWlsYWJsZVxyXG4gICAgKGFzIG9wcG9zZWQgdG8gd2FpdGluZyBmb3IgYSA0MDQgZXJyb3IgZnJvbSBORkwuY29tKS5cclxuICAgICovXHJcbn0iLCJpbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnO1xyXG5pbXBvcnQgeyBuZmxBcGlHYW1lLCBuZmxBcGlHYW1lUmVzcG9uc2UgfSBmcm9tICcuLi9zY2hlbWFzL25mbEFwaUdhbWUnO1xyXG5pbXBvcnQgUGxheWVyIGZyb20gJy4uL3NjaGVtYXMvUGxheWVyJztcclxuaW1wb3J0IFNjaGVkdWxlIGZyb20gJy4vU2NoZWR1bGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MganNvbkNhY2hlIHtcclxuICAgIGZvbGRlcnBhdGg6IHN0cmluZztcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoZmlsZXBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZm9sZGVycGF0aCA9IGZpbGVwYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEFic1BhdGgoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vIGdldCBsaXN0IG9mIGdhbWVzXHJcbiAgICBnZXRTY2hlZHVsZSgpIHtcclxuICAgICAgICBjb25zdCBzY2hlZHVsZVBhdGggPSBgJHt0aGlzLmZvbGRlcnBhdGh9L3NfbWFzdGVyLmpzb25gXHJcbiAgICAgICAgY29uc3QgZXhpc3RzID0gZnMucGF0aEV4aXN0c1N5bmMoc2NoZWR1bGVQYXRoKTtcclxuICAgICAgICBpZiAoZXhpc3RzKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzY2hlZHVsZTogU2NoZWR1bGVbXSA9IGZzLnJlYWRKU09OU3luYyhzY2hlZHVsZVBhdGgpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NoZWR1bGU7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgLy8ganNvbiByZWFkIHVuc3VjY2Vzc2Z1bFxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBwYXRoIG9yIGZpbGUgZG9lcyBub3QgZXhpc3QgYXQgYWxsXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwYXRoIGRvZXMgbm90IGV4aXN0JylcclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgc2F2ZVNjaGVkdWxlKHNjaGVkdWxlOiBTY2hlZHVsZVtdKSB7XHJcbiAgICAgICAgY29uc3Qgc2NoZWR1bGVQYXRoID0gYCR7dGhpcy5mb2xkZXJwYXRofS9zX21hc3Rlci5qc29uYFxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGZzLndyaXRlSlNPTihzY2hlZHVsZVBhdGgsIHNjaGVkdWxlKVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihlcnIpXHJcbiAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZ2V0IGxpc3Qgb2YgcGxheWVyc1xyXG4gICAgZ2V0UGxheWVyTGlzdCgpIHtcclxuICAgICAgICBjb25zdCBwbGF5ZXJQYXRoID0gYCR7dGhpcy5mb2xkZXJwYXRofS9wX21hc3Rlci5qc29uYFxyXG4gICAgICAgIGNvbnN0IGV4aXN0cyA9IGZzLnBhdGhFeGlzdHNTeW5jKHBsYXllclBhdGgpO1xyXG4gICAgICAgIGlmIChleGlzdHMpIHtcclxuICAgICAgICAgICAgY29uc3QgcGxheWVycyA9IGZzLnJlYWRKU09OU3luYyhwbGF5ZXJQYXRoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHBsYXllcnNcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4ge31cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc2F2ZSBsaXN0IG9mIHBsYXllcnNcclxuICAgIGFzeW5jIHNhdmVQbGF5ZXJMaXN0KHBsYXllcnM6IHtba2V5OiBzdHJpbmddOiBQbGF5ZXJ9KSB7XHJcbiAgICAgICAgY29uc3QgcGxheWVyUGF0aCA9IGAke3RoaXMuZm9sZGVycGF0aH0vcF9tYXN0ZXIuanNvbmBcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBhd2FpdCBmcy53cml0ZUpTT04ocGxheWVyUGF0aCwgcGxheWVycyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHRocm93IGVyclxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyByZXRyaWV2ZSBhIGdhbWUgZnJvbSB0aGUgY2FjaGVcclxuICAgIGFzeW5jIGdldEdhbWUoZ2FtZWlkOiBzdHJpbmcpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBnYW1lID0gYXdhaXQgZnMucmVhZEpTT04oYCR7dGhpcy5mb2xkZXJwYXRofS8ke2dhbWVpZH0uanNvbmApXHJcbiAgICAgICAgICAgIHJldHVybiBnYW1lXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHNhdmUgYSBnYW1lIHRvIHRoZSBjYWNoZVxyXG4gICAgYXN5bmMgc2F2ZUdhbWUoZ2FtZWlkOiBzdHJpbmcsIGRhdGE6IG5mbEFwaUdhbWUpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBhd2FpdCBmcy5vdXRwdXRKU09OKGAke3RoaXMuZm9sZGVycGF0aH0vJHtnYW1laWR9Lmpzb25gLCBkYXRhKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBheGlvcyBmcm9tICdheGlvcydcbmltcG9ydCBjaGVlcmlvIGZyb20gJ2NoZWVyaW8nXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IEdhbWVEZXRhaWxzIGZyb20gJy4uL3NjaGVtYXMvR2FtZSc7XG5pbXBvcnQgeyBTY2hlZHVsZSB9IGZyb20gJy4uL3NjaGVtYXMvU2NoZWR1bGUnO1xuXG5pbnRlcmZhY2UgZ2FtZVdlZWtBcmdzIHtcbiAgICB5ZWFyOiBudW1iZXI7XG4gICAgc3R5cGU6IHN0cmluZztcbiAgICB3ZWVrOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2Ugc2NoZWR1bGVHYW1lIHtcbiAgICBnYW1laWQ6IHN0cmluZztcbiAgICBnc2lzOiBzdHJpbmc7XG4gICAgd2RheTogc3RyaW5nO1xuICAgIHRpbWU6IHN0cmluZztcbiAgICB5ZWFyOiBudW1iZXI7XG4gICAgbW9udGg6IG51bWJlcjtcbiAgICBkYXk6IG51bWJlcjtcbiAgICBnYW1lVHlwZTogc3RyaW5nO1xuICAgIHdlZWs6IG51bWJlcjtcbiAgICAvLyBtZXJpZGllbTogbnVsbCB8IHN0cmluZztcbiAgICBxdWFydGVyOiBzdHJpbmc7XG4gICAgaG9tZVNob3J0OiBzdHJpbmc7XG4gICAgaG9tZU5hbWU6IHN0cmluZztcbiAgICBob21lU2NvcmU6IG51bWJlcjtcbiAgICBhd2F5U2hvcnQ6IHN0cmluZztcbiAgICBhd2F5TmFtZTogc3RyaW5nO1xuICAgIGF3YXlTY29yZTogbnVtYmVyO1xufVxuXG5jb25zdCBuZmxDdXJyZW50U2NoZWR1bGUgPSAnaHR0cDovL3d3dy5uZmwuY29tL2xpdmV1cGRhdGUvc2NvcmVzdHJpcC9zcy54bWwnO1xuY29uc3QgbmZsQ3VycmVudFNjaGVkdWxlUG9zdFNlYXNvbiA9ICdodHRwOi8vd3d3Lm5mbC5jb20vbGl2ZXVwZGF0ZS9zY29yZXN0cmlwL3Bvc3RzZWFzb24vc3MueG1sJztcbmNvbnN0IG5mbFJvc3RlclVybCA9ICdodHRwOi8vd3d3Lm5mbC5jb20vdGVhbXMvcm9zdGVyP3RlYW09JztcbmNvbnN0IG5mbFByb2ZpbGVVcmwgPSAnaHR0cDovL3d3dy5uZmwuY29tL3BsYXllcnMvcHJvZmlsZT9pZD0nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBORkxBcGkge1xuICAgIHN0YXRpYyBhc3luYyB5ZWFyUGhhc2VXZWVrKHdlZWs/OiBnYW1lV2Vla0FyZ3MpIHtcblxuICAgICAgICBsZXQgY3VycmVudFdlZWs6IGdhbWVXZWVrQXJncztcbiAgICAgICAgaWYgKCF3ZWVrKSB7XG4gICAgICAgICAgICBjdXJyZW50V2VlayA9IGF3YWl0IE5GTEFwaS5jdXJyZW50WWVhclBoYXNlV2VlaygpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdXJyZW50V2VlayA9IHdlZWs7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZmxZZWFyID0gW1xuICAgICAgICAgICAgWydQUkUnLCAwXSxcbiAgICAgICAgICAgIFsnUFJFJywgMV0sXG4gICAgICAgICAgICBbJ1BSRScsIDJdLFxuICAgICAgICAgICAgWydQUkUnLCAzXSxcbiAgICAgICAgICAgIFsnUFJFJywgNF0sXG4gICAgICAgICAgICBbJ1BSRScsIDVdLFxuICAgICAgICAgICAgWydSRUcnLCAxXSxcbiAgICAgICAgICAgIFsnUkVHJywgMl0sXG4gICAgICAgICAgICBbJ1JFRycsIDNdLFxuICAgICAgICAgICAgWydSRUcnLCA0XSxcbiAgICAgICAgICAgIFsnUkVHJywgNV0sXG4gICAgICAgICAgICBbJ1JFRycsIDZdLFxuICAgICAgICAgICAgWydSRUcnLCA3XSxcbiAgICAgICAgICAgIFsnUkVHJywgOF0sXG4gICAgICAgICAgICBbJ1JFRycsIDldLFxuICAgICAgICAgICAgWydSRUcnLCAxMF0sXG4gICAgICAgICAgICBbJ1JFRycsIDExXSxcbiAgICAgICAgICAgIFsnUkVHJywgMTJdLFxuICAgICAgICAgICAgWydSRUcnLCAxM10sXG4gICAgICAgICAgICBbJ1JFRycsIDE0XSxcbiAgICAgICAgICAgIFsnUkVHJywgMTVdLFxuICAgICAgICAgICAgWydSRUcnLCAxNl0sXG4gICAgICAgICAgICBbJ1JFRycsIDE3XSxcbiAgICAgICAgICAgIFsnUkVHJywgMThdLFxuICAgICAgICAgICAgWydQT1NUJywgMV0sXG4gICAgICAgICAgICBbJ1BPU1QnLCAyXSxcbiAgICAgICAgICAgIFsnUE9TVCcsIDNdLFxuICAgICAgICAgICAgWydQT1NUJywgNF0sXG4gICAgICAgICAgICBbJ1BPU1QnLCA1XSxcbiAgICAgICAgXVxuXG4gICAgICAgIGNvbnN0IHNjaGVkdWxlV2Vla3M6IGdhbWVXZWVrQXJnc1tdID0gW11cblxuXG4gICAgICAgIC8vIFRoZXJlIHNob3VsZCBiZSBhIGJldHRlciB3YXkgdG8gd3JpdGUgdGhpc1xuICAgICAgICAvLyAxLiBnZW5lcmF0ZSBhbGwgdGhlIHdlZWtzIHVwIHRvIHRoZSBjdXJyZW50IHllYXJcbiAgICAgICAgY29uc3QgbWFwV2Vla3MgPSBfLm1hcChfLnJhbmdlKDIwMDksIGN1cnJlbnRXZWVrLnllYXIgKyAxKSxcbiAgICAgICAgICAgIC8vIDIuIGdlbmVyYXRlIGJhc2VkIG9uIHRoZSBsaXN0IG9mIHNlYXNvbiBnYW1lc1xuICAgICAgICAgICAgKHkpID0+IG5mbFllYXIubWFwKCh3KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgeWVhcjogeSxcbiAgICAgICAgICAgICAgICAgICAgd2VlazogK3dbMV0sXG4gICAgICAgICAgICAgICAgICAgIHN0eXBlOiB3WzBdLnRvU3RyaW5nKClcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKVxuXG4gICAgICAgIC8vIDMuIGZsYXR0ZW4gdGhlIGFycmF5XG4gICAgICAgIGNvbnN0IGFsbFdlZWtzID0gXy5mbGF0dGVuKG1hcFdlZWtzKVxuXG4gICAgICAgIC8vIDQuIHJ1biB0aHJvdWdoIHRoZSBnZW5lcmF0ZWQgd2Vla3MgdXAgdG8gdGhlIGN1cnJlbnQgd2Vla1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbFdlZWtzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzY2hlZHVsZVdlZWtzLnB1c2goYWxsV2Vla3NbaV0pO1xuXG4gICAgICAgICAgICAvLyBzdG9wIG9uY2UgaXQgaXMgYSBjdXJyZW50IHdlZWtcbiAgICAgICAgICAgIGlmIChhbGxXZWVrc1tpXS55ZWFyID09IGN1cnJlbnRXZWVrLnllYXJcbiAgICAgICAgICAgICAgICAmJiBhbGxXZWVrc1tpXS53ZWVrID09IGN1cnJlbnRXZWVrLndlZWtcbiAgICAgICAgICAgICAgICAmJiBhbGxXZWVrc1tpXS5zdHlwZSA9PSBjdXJyZW50V2Vlay5zdHlwZSkge1xuICAgICAgICAgICAgICAgIGkgPSBhbGxXZWVrcy5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gXy5yZXZlcnNlKHNjaGVkdWxlV2Vla3MpO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRTY2hlZHVsZVVybCh5ZWFyOiBudW1iZXIsIHN0eXBlOiBzdHJpbmcsIHdlZWs6IG51bWJlcikge1xuICAgICAgICAvLyBSZXR1cm5zIHRoZSBORkwuY29tIFhNTCBzY2hlZHVsZSBVUkwuIFxuICAgICAgICBjb25zdCBiYXNlVXJsID0gJ2h0dHBzOi8vd3d3Lm5mbC5jb20vYWpheC9zY29yZXN0cmlwPydcbiAgICAgICAgaWYgKHN0eXBlID09ICdQT1NUJykge1xuICAgICAgICAgICAgd2VlayArPSAxN1xuICAgICAgICAgICAgaWYgKHdlZWsgPT0gMjEpIHtcbiAgICAgICAgICAgICAgICB3ZWVrICs9IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYCR7YmFzZVVybH1zZWFzb249JHt5ZWFyfSZzZWFzb25UeXBlPSR7c3R5cGV9JndlZWs9JHt3ZWVrfWBcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgZ2V0V2Vla1NjaGVkdWxlKHBhcmFtczogZ2FtZVdlZWtBcmdzKSB7XG5cbiAgICAgICAgY29uc3QgdXJsID0gTkZMQXBpLmdldFNjaGVkdWxlVXJsKHBhcmFtcy55ZWFyLCBwYXJhbXMuc3R5cGUsIHBhcmFtcy53ZWVrKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQodXJsKTtcbiAgICAgICAgICAgIGNvbnN0IHhtbCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICBjb25zdCAkID0gY2hlZXJpby5sb2FkKHhtbClcbiAgICAgICAgICAgIGNvbnN0IGdhbWVzOiBTY2hlZHVsZVtdID0gW11cbiAgICAgICAgICAgIC8vIGdhbWUgc2NoZWR1bGUgaXMgcmV0dXJuZWQgZnJvbSB0aGUgc2NvcmUgc3RyaXAgYXMgeG1sXG4gICAgICAgICAgICAvLyBlYWNoIDxnPiByZXByZXNlbnRzIGEgZ2FtZS5cbiAgICAgICAgICAgICQoJ2cnKS5lYWNoKChpLCBlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2lkID0gJChlKS5hdHRyKCdlaWQnKVxuICAgICAgICAgICAgICAgIGdhbWVzW2ldID0ge1xuICAgICAgICAgICAgICAgICAgICBnYW1laWQ6IGdpZCxcbiAgICAgICAgICAgICAgICAgICAgd2RheTogJChlKS5hdHRyKCdkJyksXG4gICAgICAgICAgICAgICAgICAgIGdzaXM6ICskKGUpLmF0dHIoJ2dzaXMnKSxcbiAgICAgICAgICAgICAgICAgICAgeWVhcjogcGFyYW1zLnllYXIsXG4gICAgICAgICAgICAgICAgICAgIG1vbnRoOiArZ2lkLnNsaWNlKDQsIDYpLFxuICAgICAgICAgICAgICAgICAgICBkYXk6ICtnaWQuc2xpY2UoNiwgOCksXG4gICAgICAgICAgICAgICAgICAgIHRpbWU6ICQoZSkuYXR0cigndCcpLFxuICAgICAgICAgICAgICAgICAgICBxdWFydGVyOiAkKGUpLmF0dHIoJ3EnKSxcbiAgICAgICAgICAgICAgICAgICAgZ2FtZVR5cGU6IHBhcmFtcy5zdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgd2VlazogcGFyYW1zLndlZWssXG4gICAgICAgICAgICAgICAgICAgIGhvbWVTaG9ydDogJChlKS5hdHRyKCdoJyksXG4gICAgICAgICAgICAgICAgICAgIGhvbWVOYW1lOiAkKGUpLmF0dHIoJ2hubicpLFxuICAgICAgICAgICAgICAgICAgICBob21lU2NvcmU6ICskKGUpLmF0dHIoJ2hzJyksXG4gICAgICAgICAgICAgICAgICAgIGF3YXlTaG9ydDogJChlKS5hdHRyKCd2JyksXG4gICAgICAgICAgICAgICAgICAgIGF3YXlOYW1lOiAkKGUpLmF0dHIoJ3ZubicpLFxuICAgICAgICAgICAgICAgICAgICBhd2F5U2NvcmU6ICskKGUpLmF0dHIoJ3ZzJyksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGdhbWVzKVxuICAgICAgICAgICAgcmV0dXJuIGdhbWVzXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBzdGF0aWMgYXN5bmMgY3VycmVudFllYXJQaGFzZVdlZWsoKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTY2hlZHVsZSA9IGF3YWl0IGF4aW9zLmdldChuZmxDdXJyZW50U2NoZWR1bGUpXG4gICAgICAgIGNvbnN0ICQgPSBjaGVlcmlvLmxvYWQoY3VycmVudFNjaGVkdWxlLmRhdGEpO1xuICAgICAgICBjb25zdCB3ZWVrOiBnYW1lV2Vla0FyZ3MgPSB7XG4gICAgICAgICAgICB3ZWVrOiArJCgnZ21zJykuYXR0cigndycpLFxuICAgICAgICAgICAgeWVhcjogKyQoJ2dtcycpLmF0dHIoJ3knKSxcbiAgICAgICAgICAgIHN0eXBlOiAnUkVHJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHAgPSAkKCdnbXMnKS5hdHRyKCd0JylcblxuICAgICAgICBpZiAocCA9PSAnUCcpIHtcbiAgICAgICAgICAgIHdlZWsuc3R5cGUgPSAnUFJFJ1xuICAgICAgICB9IGVsc2UgaWYgKHAgPT0gJ1BPU1QnIHx8IHAgPT0gJ1BSTycpIHtcbiAgICAgICAgICAgIHdlZWsuc3R5cGUgPSAnUE9TVCdcbiAgICAgICAgICAgIHdlZWsud2VlayAtPSAxN1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gcGhhc2UgaXMgUkVHXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gd2VlaztcbiAgICB9XG5cbiAgICAvLyBnZXRzIHRoZSBnYW1lIGRldGFpbCBkYXRhIGZyb20gTkZMJ3MgZ2FtZWNlbnRlciBlbmRwb2ludFxuICAgIHN0YXRpYyBhc3luYyBnZXRHYW1lKGdhbWVpZDogc3RyaW5nKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly93d3cubmZsLmNvbS9saXZldXBkYXRlL2dhbWUtY2VudGVyLyR7Z2FtZWlkfS8ke2dhbWVpZH1fZ3RkLmpzb25gO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQodXJsKVxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGFbZ2FtZWlkXTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyByb3N0ZXJQYXJzZXIocmF3Um9zdGVyOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgJCA9IGNoZWVyaW8ubG9hZChyYXdSb3N0ZXIpO1xuICAgICAgICBjb25zdCBldmVucyA9ICQoJ3RyW2NsYXNzPWV2ZW5dJyk7XG4gICAgICAgIGNvbnN0IG9kZHMgPSAkKCd0cltjbGFzcz1vZGRdJyk7XG4gICAgICAgIGNvbnN0IHBsYXllcnM6IGFueVtdID0gW107XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICBjb25zdCBhZGRQbGF5ZXIgPSAoaW5kZXgsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSAkKGVsZW1lbnQpLmNoaWxkcmVuKClcbiAgICAgICAgICAgIGNvbnN0IHBsYXllcjogYW55ID0ge31cbiAgICAgICAgICAgIG1ldGEuZWFjaCgoaSwgZSkgPT4ge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoaSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIubnVtYmVyID0gJChlKS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9ICQoZSkuY2hpbGRyZW4oKS5maXJzdCgpLnRleHQoKS50cmltKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYW1lLmluY2x1ZGVzKCcsJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIubGFzdE5hbWUgPSBuYW1lLnNwbGl0KCcsJylbMF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZmlyc3ROYW1lID0gbmFtZS5zcGxpdCgnLCcpWzFdXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5sYXN0TmFtZSA9IG5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZmlyc3ROYW1lID0gJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5wcm9maWxlVXJsID0gJChlKS5jaGlsZHJlbigpLmZpcnN0KCkuYXR0cignaHJlZicpXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGxheWVyaWQgPSBwcm9maWxlSWRGcm9tVXJsKHBsYXllci5wcm9maWxlVXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucG9zaXRpb24gPSAkKGUpLnRleHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzogXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuc3RhdHVzID0gJChlKS50ZXh0KClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuaGVpZ2h0ID0gJChlKS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLndlaWdodCA9ICQoZSkudGV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5iaXJ0aGRhdGUgPSAkKGUpLnRleHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIueWV4cCA9ICQoZSkudGV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5jb2xsZWdlID0gJChlKS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICAgIH1cblxuICAgICAgICBldmVucy5lYWNoKGFkZFBsYXllcik7XG4gICAgICAgIG9kZHMuZWFjaChhZGRQbGF5ZXIpO1xuICAgICAgICByZXR1cm4gcGxheWVycztcbiAgICAgICAgLy8gcmV0dXJuIF8uY29uY2F0KGV2ZW5zLCBvZGRzKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgZ2V0Um9zdGVyKHRlYW06IHN0cmluZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gbmZsUm9zdGVyVXJsICsgdGVhbVxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQodXJsKTtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IGVyclxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGdldFBsYXllclByb2ZpbGUoZ3Npc0lkOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQoYGh0dHBzOi8vd3d3Lm5mbC5jb20vcGxheWVycy9wcm9maWxlP2lkPSR7Z3Npc0lkfWApO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHByb2ZpbGVJZEZyb21VcmwodXJsOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdXJsLm1hdGNoKC8oWzAtOV0rKS8pIVswXTtcbn1cbiIsImltcG9ydCBjaGVlcmlvIGZyb20gJ2NoZWVyaW8nO1xyXG5pbXBvcnQgUGxheWVyIGZyb20gJy4uL3NjaGVtYXMvUGxheWVyJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVByb2ZpbGUoaHRtbDogc3RyaW5nKTogUGxheWVyIHtcclxuICAgIGNvbnN0ICQgPSBjaGVlcmlvLmxvYWQoaHRtbCk7XHJcbiAgICAvLyBudW1iZXIgYW5kIHBvc3RpaW9uIG9ubHkgYXZhaWxhYmxlIHRvIGFjdGl2ZSBwbGF5ZXJzXHJcbiAgICBjb25zdCBudW1iZXJTdHJpcCA9ICQoJ3NwYW4ucGxheWVyLW51bWJlcicpLnRleHQoKVxyXG4gICAgLy8gY29uc3QgcGxheWVySW5mbyA9ICQoJ2Rpdi5wbGF5ZXItaW5mbycpLmNoaWxkcmVuKClcclxuICAgIGNvbnN0IG5hbWVTdHJpcCA9ICQoJyNwbGF5ZXJOYW1lJykuYXR0cignY29udGVudCcpO1xyXG4gICAgY29uc3QgcGxheWVySWQgPSAkKCcjcGxheWVySWQnKS5hdHRyKCdjb250ZW50Jyk7XHJcbiAgICBsZXQgdGVhbSA9ICQoJyNwbGF5ZXJUZWFtJykuYXR0cignY29udGVudCcpO1xyXG4gICAgY29uc3QgdXJsID0gJCgnbGlua1tyZWw9Y2Fub25pY2FsXScpLmF0dHIoJ2hyZWYnKVxyXG4gICAgLy8gY29uc3QgcGh5c2ljYWxSb3cgPSBwbGF5ZXJJbmZvLmZpbHRlcigoaSwgZSkgPT4gaSA9PSAyKTtcclxuICAgIC8vIHJlZ2V4IHNlZW1zIHRvIGJlIHRoZSBlYXNpZXN0IHdheSB0byBnZXQgYXQgdGhlc2Ugc3BlY2lmaWMgcGllY2VzIG9mIGRhdGEuXHJcbiAgICBjb25zdCBnc2lzSWQgPSBodG1sLm1hdGNoKC8oPzpHU0lTIElEOiApXFxXKihcXGQrXFxXK1xcZCspLykhWzFdXHJcbiAgICBjb25zdCBoZWlnaHRTdHJpcCA9IGh0bWwubWF0Y2goLyg/OjxzdHJvbmc+KSg/OkhlaWdodCkoPzo8XFwvc3Ryb25nPilcXFdcXHMoXFxkK1xcV1xcZCspLykhWzFdXHJcbiAgICBjb25zdCB3ZWlnaHRTdHJpcCA9IGh0bWwubWF0Y2goLyg/OjxzdHJvbmc+KSg/OldlaWdodCkoPzo8XFwvc3Ryb25nPilcXFdcXHMoXFxkKykvKSFbMV1cclxuICAgIGNvbnN0IGFnZVN0cmlwID0gaHRtbC5tYXRjaCgvKD86PHN0cm9uZz4pKD86QWdlKSg/OjxcXC9zdHJvbmc+KVxcV1xccyhcXGQrKS8pIVsxXVxyXG4gICAgY29uc3QgYmlydGhTdHJpcCA9IGh0bWwubWF0Y2goLyg/OjxzdHJvbmc+KSg/OkJvcm4pKD86PFxcL3N0cm9uZz4pXFxXK1xccysoXFxkezEsMn1cXC9cXGR7MSwyfVxcL1xcZHs0fSlcXHMrKFxcYlthLXpBLVpcXHNdKyxbIF0/W0EtWl17Mn1cXGIpLylcclxuICAgIGNvbnN0IGNvbGxlZ2VTdHJpcCA9IGh0bWwubWF0Y2goLyg/OjxzdHJvbmc+KSg/OkNvbGxlZ2UpKD86PFxcL3N0cm9uZz4pXFxXXFxzKyhbXFx3LVxcc10rKS8pXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2cobnVtYmVyU3RyaXApO1xyXG4gICAgbGV0IG51bWJlciA9IDBcclxuICAgIGxldCBwb3NpdGlvbiA9ICcnXHJcblxyXG4gICAgLy8gVE9ETzogYSBsb3Qgb2YgcmVkdW5kYW5jeSBoZXJlLlxyXG4gICAgY29uc3QgZmlyc3ROYW1lID0gbmFtZVN0cmlwLnNwbGl0KCcgJylbMF0udHJpbSgpXHJcbiAgICBjb25zdCBsYXN0TmFtZSA9IG5hbWVTdHJpcC5zcGxpdCgnICcpWzFdLnRyaW0oKVxyXG4gICAgY29uc3QgZnVsbE5hbWUgPSBgJHtmaXJzdE5hbWV9ICR7bGFzdE5hbWV9YFxyXG5cclxuICAgIGxldCBiaXJ0aERhdGUgPSAnJztcclxuICAgIGxldCBiaXJ0aENpdHkgPSAnJztcclxuICAgIGlmIChiaXJ0aFN0cmlwICE9IG51bGwpIHtcclxuICAgICAgICBiaXJ0aERhdGUgPSBiaXJ0aFN0cmlwIVsxXVxyXG4gICAgICAgIGJpcnRoQ2l0eSA9IGJpcnRoU3RyaXAhWzJdXHJcbiAgICB9XHJcbiAgICBjb25zdCB3ZWlnaHQgPSArd2VpZ2h0U3RyaXBcclxuICAgIGNvbnN0IGNvbGxlZ2UgPSBjb2xsZWdlU3RyaXAhWzFdXHJcbiAgICBjb25zdCBhZ2UgPSArYWdlU3RyaXBcclxuICAgIGNvbnN0IGhlaWdodCA9IGZlZXRJbmNoZXNUb0luY2hlcyhoZWlnaHRTdHJpcClcclxuXHJcbiAgICBpZiAobnVtYmVyU3RyaXAgPT0gbnVsbCkge1xyXG4gICAgICAgIHRlYW0gPSAnJ1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBudW1iZXJQcmVzZW50ID0gbnVtYmVyU3RyaXAubWF0Y2goLyhcXGQrKS8pXHJcbiAgICAgICAgY29uc3QgcG9zaXRpb25QcmVzZW50ID0gbnVtYmVyU3RyaXAubWF0Y2goLyhbQS1aXSspLylcclxuICAgICAgICBpZiAobnVtYmVyUHJlc2VudCAhPSBudWxsICYmIHBvc2l0aW9uUHJlc2VudCAhPSBudWxsICkge1xyXG4gICAgICAgICAgICBudW1iZXIgPSArbnVtYmVyU3RyaXAubWF0Y2goLyhcXGQrKS8pIVswXVxyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IG51bWJlclN0cmlwLm1hdGNoKC8oW0EtWl0rKS8pIVswXVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGZ1bGxOYW1lLFxyXG4gICAgICAgIHBsYXllcklkLFxyXG4gICAgICAgIHRlYW0sXHJcbiAgICAgICAgZmlyc3ROYW1lLFxyXG4gICAgICAgIGdzaXNJZCxcclxuICAgICAgICBsYXN0TmFtZSxcclxuICAgICAgICBiaXJ0aENpdHksXHJcbiAgICAgICAgYmlydGhEYXRlLFxyXG4gICAgICAgIGNvbGxlZ2UsXHJcbiAgICAgICAgYWdlLFxyXG4gICAgICAgIHByb2ZpbGVVcmw6IHVybCxcclxuICAgICAgICBwcm9maWxlSWQ6IHByb2ZpbGVJZEZyb21VcmwodXJsKSxcclxuICAgICAgICBudW1iZXIsXHJcbiAgICAgICAgcG9zaXRpb24sXHJcbiAgICAgICAgd2VpZ2h0LFxyXG4gICAgICAgIGhlaWdodFxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9maWxlSWRGcm9tVXJsKHVybDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gdXJsLm1hdGNoKC8oWzAtOV0rKS8pIVswXTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmVldEluY2hlc1RvSW5jaGVzKGhlaWdodDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBbZmVldCwgaW5jaGVzXSA9IGhlaWdodC5zcGxpdCgnLScpXHJcbiAgICByZXR1cm4gMTIgKiArZmVldCArICtpbmNoZXNcclxufSIsImltcG9ydCBqc29uQ2FjaGUgZnJvbSAnLi9qc29uQ2FjaGUnO1xyXG5pbXBvcnQgUGxheWVyIGZyb20gJy4uL3NjaGVtYXMvUGxheWVyJztcclxuaW1wb3J0IE5GTEFwaSBmcm9tICcuL25mbEFwaSc7XHJcbmltcG9ydCB7IHNlYXJjaFNjaGVkdWxlQXJncywgU2NoZWR1bGUgfSBmcm9tICcuLi9zY2hlbWFzL1NjaGVkdWxlJztcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgbmZsQXBpR2FtZSwgbmZsQXBpR2FtZVJlc3BvbnNlIH0gZnJvbSAnLi4vc2NoZW1hcy9uZmxBcGlHYW1lJztcclxuaW1wb3J0IHsgcGFyc2VQcm9maWxlIH0gZnJvbSAnLi9uZmxQbGF5ZXInO1xyXG5pbXBvcnQgeyBnZXRQbGF5ZXJTdGF0cywgcGFyc2VHYW1lIH0gZnJvbSAnLi9HYW1lJztcclxuXHJcbmZ1bmN0aW9uIHRyYW5zcG9zZUFyZ3MoYXJnczogc2VhcmNoU2NoZWR1bGVBcmdzKSB7XHJcbiAgICBjb25zdCBwYXJhbXM6IGFueSA9IHtcclxuICAgICAgICBob21lU2hvcnQ6IGFyZ3MuaG9tZSxcclxuICAgICAgICBhd2F5U2hvcnQ6IGFyZ3MuYXdheSxcclxuICAgICAgICBnYW1lVHlwZTogYXJncy5zZWFzb25fdHlwZSxcclxuICAgICAgICB3ZWVrOiBhcmdzLndlZWssXHJcbiAgICAgICAgeWVhcjogYXJncy55ZWFyXHJcbiAgICB9XHJcbiAgICByZXR1cm4gXy5vbWl0QnkocGFyYW1zLCBfLmlzVW5kZWZpbmVkKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgbmZsR2FtZSB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogbmZsR2FtZTtcclxuICAgIHByaXZhdGUgc3RhdGljIGZpbGVQYXRoOiBzdHJpbmc7XHJcbiAgICBjYWNoZToganNvbkNhY2hlO1xyXG4gICAgbmZsQXBpOiBORkxBcGk7XHJcbiAgICBzY2hlZHVsZTogU2NoZWR1bGVbXTtcclxuICAgIHBsYXllcnM6IHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBQbGF5ZXJcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgbmZsR2FtZS5maWxlUGF0aCA9IGZpbGVQYXRoO1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBuZXcganNvbkNhY2hlKGZpbGVQYXRoKTtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLnNjaGVkdWxlID0gdGhpcy5jYWNoZS5nZXRTY2hlZHVsZSgpO1xyXG4gICAgICAgIHRoaXMucGxheWVycyA9IHRoaXMuY2FjaGUuZ2V0UGxheWVyTGlzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZShmaWxlUGF0aD86IHN0cmluZykge1xyXG4gICAgICAgIGlmICghbmZsR2FtZS5pbnN0YW5jZSAmJiBmaWxlUGF0aCkge1xyXG4gICAgICAgICAgICBuZmxHYW1lLmluc3RhbmNlID0gbmV3IG5mbEdhbWUoZmlsZVBhdGgpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmZsR2FtZS5pbnN0YW5jZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGZpbGVQYXRoICE9IG5mbEdhbWUuZmlsZVBhdGggJiYgZmlsZVBhdGgpIHtcclxuICAgICAgICAgICAgbmZsR2FtZS5pbnN0YW5jZSA9IG5ldyBuZmxHYW1lKGZpbGVQYXRoKVxyXG4gICAgICAgICAgICByZXR1cm4gbmZsR2FtZS5pbnN0YW5jZTtcclxuICAgICAgICB9IGVsc2UgaWYgKCFuZmxHYW1lLmluc3RhbmNlICYmICFmaWxlUGF0aCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZpbGVwYXRoIGlzIG5vdCBzZXQsIGNhbm5vdCByZXRyaWV2ZSBjYWNoZScpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5mbEdhbWUuaW5zdGFuY2VcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgcmVnZW5lcmF0ZVNjaGVkdWxlKCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdhbWVzVGlsbE5vdyA9IGF3YWl0IE5GTEFwaS55ZWFyUGhhc2VXZWVrKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGdhbWVzID0gYXdhaXQgUHJvbWlzZS5hbGwoZ2FtZXNUaWxsTm93Lm1hcChORkxBcGkuZ2V0V2Vla1NjaGVkdWxlKSk7XHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICBjb25zdCBzYXZlID0gYXdhaXQgdGhpcy5jYWNoZS5zYXZlU2NoZWR1bGUoXy5mbGF0dGVuKGdhbWVzKSlcclxuICAgICAgICAgICAgcmV0dXJuIHNhdmU7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgc2VhcmNoU2NoZWR1bGUoYXJnczogc2VhcmNoU2NoZWR1bGVBcmdzKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codHJhbnNwb3NlQXJncyhhcmdzKSk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2NoZWR1bGUubGVuZ3RoIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5yZWdlbmVyYXRlU2NoZWR1bGUoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfLmZpbHRlcih0aGlzLnNjaGVkdWxlLCB0cmFuc3Bvc2VBcmdzKGFyZ3MpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfLmZpbHRlcih0aGlzLnNjaGVkdWxlLCB0cmFuc3Bvc2VBcmdzKGFyZ3MpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHVwZGF0ZVBsYXllcnMoKSB7XHJcbiAgICAgICAgLy8gbm90IG5lZWRlZCBhcyBwbGF5ZXJzIGNhbiBiZSBmZXRjaGVkIG9uIHRoZSBmbHlcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBnZXRHYW1lKGdhbWVpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgbmZsR2FtZSA9IGF3YWl0IHRoaXMuZ2V0R2FtZWNlbnRlckdhbWUoZ2FtZWlkKTtcclxuICAgICAgICAgICAgY29uc3QgZ2FtZSA9IHBhcnNlR2FtZShuZmxHYW1lKTtcclxuICAgICAgICAgICAgZ2FtZS5nYW1laWQgPSBnYW1laWQ7XHJcbiAgICAgICAgICAgIHJldHVybiBnYW1lO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICByZXR1cm4ge31cclxuICAgICAgICAgICAgLy8gdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyBnZXRHYW1lY2VudGVyR2FtZShnYW1laWQ/OiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIWdhbWVpZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGdhbWVpZCBwYXNzZWQnKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBjYWNoZUdhbWUgPSBhd2FpdCB0aGlzLmNhY2hlLmdldEdhbWUoZ2FtZWlkKTtcclxuICAgICAgICAgICAgaWYgKCFjYWNoZUdhbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdnYW1lIGlzIG5vdCBmb3VuZCBpbiBjYWNoZSwgcHVsbGluZyBmcm9tIG5mbC5jb20nKVxyXG4gICAgICAgICAgICAgICAgLy8gaWYgY2FjaGVkIGdhbWUgaXMgbm90IGZvdW5kLFxyXG4gICAgICAgICAgICAgICAgLy8gd2UgZmV0Y2ggdGhlIGdhbWUgZnJvbSBORkwuY29tXHJcbiAgICAgICAgICAgICAgICBjb25zdCBnYW1lUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmZldGNoR2FtZShnYW1laWQpO1xyXG4gICAgICAgICAgICAgICAgLy8gYW5kIHNhdmUgaXQgdG8gY2FjaGVcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuY2FjaGUuc2F2ZUdhbWUoZ2FtZWlkLCBnYW1lUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgLy8gYmVmb3JlIHJldHVybmluZyBpdCB0byB0aGUgdXNlclxyXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgZ2FtZVJlc3BvbnNlLmdhbWVpZCA9IGdhbWVpZDtcclxuICAgICAgICAgICAgICAgIHJldHVybiBnYW1lUmVzcG9uc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgZ2FtZSBpcyBmb3VuZCBpbiBjYWNoZSB0aGF0IGlzIHJldHVybmVkIGluc3RlYWQuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZ2FtZSBmb3VuZCBpbiBjYWNoZScpXHJcbiAgICAgICAgICAgICAgICBjYWNoZUdhbWUuZ2FtZWlkID0gZ2FtZWlkO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlR2FtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGdldEFnZ0dhbWVTdGF0cyhnYW1laWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdhbWUgPSBhd2FpdCB0aGlzLmdldEdhbWVjZW50ZXJHYW1lKGdhbWVpZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRQbGF5ZXJTdGF0cyhnYW1lKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIGZldGNoR2FtZShnYW1laWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdhbWU6IG5mbEFwaUdhbWUgPSBhd2FpdCBORkxBcGkuZ2V0R2FtZShnYW1laWQpXHJcbiAgICAgICAgICAgIHJldHVybiBnYW1lXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgZmV0Y2hQbGF5ZXIoZ3Npc0lkOiBzdHJpbmcpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBodG1sID0gYXdhaXQgTkZMQXBpLmdldFBsYXllclByb2ZpbGUoZ3Npc0lkKVxyXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXIgPSBwYXJzZVByb2ZpbGUoaHRtbCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyc1tnc2lzSWRdID0gcGxheWVyO1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNhY2hlLnNhdmVQbGF5ZXJMaXN0KHRoaXMucGxheWVycyk7XHJcbiAgICAgICAgICAgIHJldHVybiBwbGF5ZXJcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxyXG4gICAgICAgICAgICB0aHJvdyBlcnJvclxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBnZXRQbGF5ZXIoZ3Npc0lkOiBzdHJpbmcpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBtYXRjaCA9IF8uZmlsdGVyKHRoaXMucGxheWVycywgeyBnc2lzSWQ6IGdzaXNJZCB9KTtcclxuICAgICAgICAgICAgaWYgKG1hdGNoLmxlbmd0aCA8IDEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwbGF5ZXIgbm90IGZvdW5kLi4uIGZldGNoaW5nJylcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IGF3YWl0IHRoaXMuZmV0Y2hQbGF5ZXIoZ3Npc0lkKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYGFkZGVkICR7cGxheWVyLmZ1bGxOYW1lfWApXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxheWVyO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3BsYXllciBmb3VuZCcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2hbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICByZXR1cm4ge31cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZ2V0R2FtZXNCeVNjaGVkdWxlKHBhcmFtczogc2VhcmNoU2NoZWR1bGVBcmdzKSB7XHJcbiAgICAgICAgY29uc3QgbWF0Y2ggPSBwYXJhbXNcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhtYXRjaClcclxuICAgICAgICByZXR1cm4gXy5maWx0ZXIodGhpcy5zY2hlZHVsZSwgbWF0Y2gpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcclxuaW1wb3J0IHsgUmVzb2x2ZXIsIFF1ZXJ5LCBBcmdzLCBGaWVsZFJlc29sdmVyLCBSb290IH0gZnJvbSBcInR5cGUtZ3JhcGhxbFwiO1xyXG5pbXBvcnQgeyBBZ2dHYW1lU3RhdCwgQWdnR2FtZVN0YXRBcmdzIH0gZnJvbSBcIi4uL3NjaGVtYXMvQWdnR2FtZVN0YXRcIjtcclxuaW1wb3J0IG5mbEdhbWUgZnJvbSBcIi4uL25mbGdhbWUvbmZsZ2FtZVwiO1xyXG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XHJcblxyXG5AUmVzb2x2ZXIob2YgPT4gQWdnR2FtZVN0YXQpXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFnZ0dhbWVTdGF0UmVzb2x2ZXIge1xyXG4gICAgQFF1ZXJ5KHJldHVybnMgPT4gW0FnZ0dhbWVTdGF0XSlcclxuICAgIGFzeW5jIGdldEdhbWVTdGF0c0J5R2FtZUlkKFxyXG4gICAgICAgIEBBcmdzKCkgcGFyYW1zOiBBZ2dHYW1lU3RhdEFyZ3NcclxuICAgICkge1xyXG4gICAgICAgIGlmKCFwYXJhbXMuaWQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGlkIHBhc3NlZCcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCBzdGF0cyA9IGF3YWl0IG5mbEdhbWUuZ2V0SW5zdGFuY2UoKS5nZXRBZ2dHYW1lU3RhdHMocGFyYW1zLmlkKTtcclxuICAgICAgICAgICAgLy8gaWYgKG5hbWUgfHwgY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgLy8gICAgIGNvbnN0IGZpbHRlciA9IHt9XHJcbiAgICAgICAgICAgIC8vICAgICBpZihuYW1lKXtcclxuICAgICAgICAgICAgLy8gICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgLy8gICAgICAgICBmaWx0ZXIubmFtZSA9IG5hbWVcclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gICAgIGlmKGNhdGVnb3J5KXtcclxuICAgICAgICAgICAgLy8gICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgLy8gICAgICAgICBmaWx0ZXIuY2F0ZWdvcnkgPSBjYXRlZ29yeVxyXG4gICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgc3RhdHMgPSBfLmZpbHRlcihzdGF0cywgZmlsdGVyKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdHNcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBARmllbGRSZXNvbHZlcigpXHJcbiAgICBhc3luYyBwbGF5ZXIoQFJvb3QoKSBzdGF0OiBBZ2dHYW1lU3RhdCkge1xyXG4gICAgICAgIHJldHVybiBhd2FpdCBuZmxHYW1lLmdldEluc3RhbmNlKCkuZ2V0UGxheWVyKHN0YXQucGxheWVySWQpXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSZXNvbHZlciwgUXVlcnksIEFyZywgQXJncywgRmllbGRSZXNvbHZlciwgUm9vdCB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcclxuaW1wb3J0IHsgQWdnR2FtZVN0YXRBcmdzLCBBZ2dHYW1lU3RhdCB9IGZyb20gJy4uL3NjaGVtYXMvQWdnR2FtZVN0YXQnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgR2FtZURldGFpbHMgZnJvbSBcIi4uL3NjaGVtYXMvR2FtZVwiO1xyXG5pbXBvcnQgbmZsR2FtZSBmcm9tIFwiLi4vbmZsZ2FtZS9uZmxnYW1lXCI7XHJcbi8vIGltcG9ydCB7IGdldEdhbWVCeUlkLCBnZXRHYW1lU3RhdHMgfSBmcm9tICcuLi9uZmxnYW1lL0dhbWUnXHJcblxyXG4vLyBAUmVzb2x2ZXIob2YgPT4gR2FtZSlcclxuLy8gZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4vLyAgICAgQFF1ZXJ5KHJldHVybnMgPT4gR2FtZSwgeyBudWxsYWJsZTogdHJ1ZSB9KVxyXG4vLyAgICAgYXN5bmMgZ2FtZUJ5aWQoQEFyZyhcImVpZFwiKSBlaWQ6IG51bWJlcik6IFByb21pc2U8YW55PiB7IH1cclxuLy8gfVxyXG5cclxuQFJlc29sdmVyKG9mID0+IEdhbWVEZXRhaWxzKVxyXG5leHBvcnQgY2xhc3MgR2FtZURldGFpbHNSZXNvbHZlcntcclxuICAgIEBRdWVyeShyZXR1cm5zID0+IEdhbWVEZXRhaWxzKVxyXG4gICAgYXN5bmMgZ2V0R2FtZUJ5SWQoQEFyZygnaWQnKSBpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgZ2FtZSA9IGF3YWl0IG5mbEdhbWUuZ2V0SW5zdGFuY2UoKS5nZXRHYW1lY2VudGVyR2FtZShpZCk7XHJcbiAgICAgICAgZ2FtZS5laWQgPSBpZDtcclxuICAgICAgICByZXR1cm4gZ2FtZVxyXG4gICAgfVxyXG5cclxuICAgIEBGaWVsZFJlc29sdmVyKClcclxuICAgIGFzeW5jIGFnZ3JlZ2F0ZWRHYW1lU3RhdHMoQFJvb3QoKSBnYW1lOiBHYW1lRGV0YWlscykge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGdhbWUuZ2FtZWlkKTtcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICBsZXQgc3RhdHM6IEFnZ0dhbWVTdGF0W10gPSBhd2FpdCBuZmxHYW1lLmdldEluc3RhbmNlKCkuZ2V0QWdnR2FtZVN0YXRzKGdhbWUuZ2FtZWlkKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocGFyYW1zKTtcclxuICAgICAgICAgICAgLy8gaWYgKHBhcmFtcy5uYW1lIHx8IHBhcmFtcy5jYXRlZ29yeSkge1xyXG4gICAgICAgICAgICAvLyAgICAgY29uc3QgZmlsdGVyID0ge31cclxuICAgICAgICAgICAgLy8gICAgIGlmIChwYXJhbXMubmFtZSkge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAvLyAgICAgICAgIGZpbHRlci5uYW1lID0gcGFyYW1zLm5hbWVcclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gICAgIGlmIChwYXJhbXMuY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgLy8gICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgZmlsdGVyLmNhdGVnb3J5ID0gcGFyYW1zLmNhdGVnb3J5XHJcbiAgICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAgIC8vICAgICBzdGF0cyA9IF8uZmlsdGVyKHN0YXRzLCBmaWx0ZXIpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0c1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IFwicmVmbGVjdC1tZXRhZGF0YVwiO1xyXG5pbXBvcnQgeyBBcmdzLCBBcmdzVHlwZSwgRmllbGQsIFF1ZXJ5LCBSZXNvbHZlciwgRmllbGRSZXNvbHZlciwgUm9vdCB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcclxuaW1wb3J0IHtzZWFyY2hTY2hlZHVsZUFyZ3MsIFNjaGVkdWxlfSBmcm9tICcuLi9zY2hlbWFzL1NjaGVkdWxlJztcclxuXHJcbmltcG9ydCBuZmxHYW1lIGZyb20gXCIuLi9uZmxnYW1lL25mbGdhbWVcIjtcclxuXHJcbkBSZXNvbHZlcihvZiA9PiBTY2hlZHVsZSlcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NoZWR1bGVSZXNvbHZlciB7XHJcblxyXG4gICAgQFF1ZXJ5KHJldHVybnMgPT4gW1NjaGVkdWxlXSwgeyBudWxsYWJsZTogdHJ1ZSB9KVxyXG4gICAgYXN5bmMgc2VhcmNoU2NoZWR1bGUoQEFyZ3MoKSBpbnB1dDogc2VhcmNoU2NoZWR1bGVBcmdzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3Qgc2NoZWR1bGUgPSBhd2FpdCBuZmxHYW1lLmdldEluc3RhbmNlKCkuc2VhcmNoU2NoZWR1bGUoaW5wdXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2NoZWR1bGU7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEBGaWVsZFJlc29sdmVyKClcclxuICAgIGFzeW5jIGdhbWUoQFJvb3QoKSBzY2hlZHVsZTogU2NoZWR1bGUpe1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdhbWUgPSBhd2FpdCBuZmxHYW1lLmdldEluc3RhbmNlKCkuZ2V0R2FtZShzY2hlZHVsZS5nYW1laWQpXHJcbiAgICAgICAgICAgIHJldHVybiBnYW1lXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHt9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBSZXNvbHZlciwgUXVlcnksIEFyZywgRmllbGRSZXNvbHZlciwgUm9vdCB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcclxuaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vc2NoZW1hcy9QbGF5ZXJcIjtcclxuaW1wb3J0IG5mbEdhbWUgZnJvbSBcIi4uL25mbGdhbWUvbmZsZ2FtZVwiO1xyXG4vLyBpbXBvcnQgeyBnZXRQbGF5ZXJCeUlkIH0gZnJvbSBcIi4uL25mbGdhbWUvbmZsUGxheWVyXCI7XHJcblxyXG4vLyBAUmVzb2x2ZXIob2YgPT4gR2FtZSlcclxuLy8gZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4vLyAgICAgQFF1ZXJ5KHJldHVybnMgPT4gR2FtZSwgeyBudWxsYWJsZTogdHJ1ZSB9KVxyXG4vLyAgICAgYXN5bmMgZ2FtZUJ5aWQoQEFyZyhcImVpZFwiKSBlaWQ6IG51bWJlcik6IFByb21pc2U8YW55PiB7IH1cclxuLy8gfVxyXG5cclxuQFJlc29sdmVyKG9mID0+IFBsYXllcilcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gICAgQFF1ZXJ5KHJldHVybnMgPT4gUGxheWVyKVxyXG4gICAgYXN5bmMgUGxheWVyKEBBcmcoJ2lkJykgaWQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHAgPSBhd2FpdCBuZmxHYW1lLmdldEluc3RhbmNlKCkuZ2V0UGxheWVyKGlkKTtcclxuICAgICAgICByZXR1cm4gcFxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IE9iamVjdFR5cGUsIEZpZWxkLCBJRCwgSW5wdXRUeXBlLCBBcmdzVHlwZSB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcclxuaW1wb3J0IFBsYXllciBmcm9tIFwiLi9QbGF5ZXJcIjtcclxuaW1wb3J0IHsgZnJvbU51bWJlciB9IGZyb20gXCJsb25nXCI7XHJcblxyXG5AQXJnc1R5cGUoKVxyXG5leHBvcnQgY2xhc3MgQWdnR2FtZVN0YXRBcmdzIHtcclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgaWQ/OiBzdHJpbmdcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHBsYXllck5hbWU/OiBzdHJpbmdcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGNhdGVnb3J5Pzogc3RyaW5nXHJcbn1cclxuXHJcbkBPYmplY3RUeXBlKClcclxuZXhwb3J0IGNsYXNzIEFnZ0dhbWVTdGF0IHtcclxuICAgIEBGaWVsZCh0eXBlID0+IFBsYXllcilcclxuICAgIHBsYXllcj86IFBsYXllclxyXG5cclxuICAgIEBGaWVsZCh0eXBlID0+IElEKVxyXG4gICAgcGxheWVySWQ6IHN0cmluZ1xyXG5cclxuICAgIEBGaWVsZCgpXHJcbiAgICBuYW1lOiBzdHJpbmdcclxuXHJcbiAgICBARmllbGQoKVxyXG4gICAgY2F0ZWdvcnk6IHN0cmluZ1xyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgcGFzc2luZ19hdHQ/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHBhc3NpbmdfY21wPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBwYXNzaW5nX3lkcz86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgcGFzc2luZ19pbnRzPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBwYXNzaW5nX3R3b3B0YT86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgcGFzc2luZ190d29wdG0/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHJ1c2hpbmdfYXR0PzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBydXNoaW5nX3lkcz86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgcnVzaGluZ190ZHM/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHJ1c2hpbmdfbG5nPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBydXNoaW5nX2xuZ3RkPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBydXNoaW5nX3R3b3B0YT86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgcnVzaGluZ190d29wdG0/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHJlY2VpdmluZ19yZWM/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHJlY2VpdmluZ195ZHM/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHJlY2VpdmluZ190ZHM/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHJlY2VpdmluZ19sbmc/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHJlY2VpdmluZ19sbmd0ZD86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgcmVjZWl2aW5nX3R3b3B0YT86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgcmVjZWl2aW5nX3R3b3B0bT86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgZnVtYmxlc19mb3JjZWQ/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGZ1bWJsZXNfbG9zdD86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgZnVtYmxlc19ub3Rmb3JjZWQ/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGZ1bWJsZXNfb29iPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBmdW1ibGVzX3JlY195ZHM/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGZ1bWJsZXNfdG90PzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBmdW1ibGVzX3JlY190ZHM/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGtpY2tpbmdfZmdtPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBraWNraW5nX2ZnYT86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAga2lja2luZ19mZ3lkcz86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAga2lja2luZ190b3RwZmc/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGtpY2tpbmdfeHBtYWRlPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBraWNraW5nX3hwYT86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAga2lja2luZ194cGI/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGtpY2tpbmdfeHB0b3Q/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHB1bnRpbmdfcHRzPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBwdW50aW5nX3lkcz86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgcHVudGluZ19hdmc/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHB1bnRpbmdfaTIwPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBwdW50aW5nX2xuZz86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAga2lja3JldF9yZXQ/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGtpY2tyZXRfYXZnPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBraWNrcmV0X3Rkcz86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAga2lja3JldF9sbmc/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGtpY2tyZXRfbG5ndGQ/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHB1bnRyZXRfcmV0PzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBwdW50cmV0X2F2Zz86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgcHVudHJldF90ZHM/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHB1bnRyZXRfbG5nPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBwdW50cmV0X2xuZ3RkPzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBkZWZlbnNlX3RrbD86IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgZGVmZW5zZV9hc3Q/OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIGRlZmVuc2VfaW50PzogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBkZWZlbnNlX2ZmdW0/OiBudW1iZXJcclxufSIsImltcG9ydCB7IEZpZWxkLCBPYmplY3RUeXBlLCBJRCB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcclxuaW1wb3J0IHsgQWdnR2FtZVN0YXQgfSBmcm9tIFwiLi9BZ2dHYW1lU3RhdFwiO1xyXG5cclxuLy8gT2JqZWN0VHlwZSBkZWZpbmVzIGNsYXNzIGFzIGEgR3JhcGhRTCB0eXBlXHJcbkBPYmplY3RUeXBlKClcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZURldGFpbHMge1xyXG4gICAgQEZpZWxkKHR5cGUgPT4gSUQpXHJcbiAgICBnYW1laWQ/OiBzdHJpbmc7XHJcblxyXG4gICAgQEZpZWxkKClcclxuICAgIHdlYXRoZXI6IHN0cmluZztcclxuXHJcbiAgICBARmllbGQoeyBudWxsYWJsZTogdHJ1ZSB9KVxyXG4gICAgbWVkaWE6IHN0cmluZztcclxuXHJcbiAgICBARmllbGQoKVxyXG4gICAgeWw6IHN0cmluZztcclxuXHJcbiAgICBARmllbGQoKVxyXG4gICAgcXRyOiBzdHJpbmc7XHJcblxyXG4gICAgQEZpZWxkKHsgbnVsbGFibGU6IHRydWUgfSlcclxuICAgIG5vdGU6IHN0cmluZztcclxuXHJcbiAgICBARmllbGQoKVxyXG4gICAgZG93bjogbnVtYmVyO1xyXG5cclxuICAgIEBGaWVsZCgpXHJcbiAgICB0b2dvOiBudW1iZXI7XHJcblxyXG4gICAgQEZpZWxkKClcclxuICAgIHJlZHpvbmU6IGJvb2xlYW47XHJcblxyXG4gICAgQEZpZWxkKClcclxuICAgIGNsb2NrOiBzdHJpbmc7XHJcblxyXG4gICAgQEZpZWxkKHsgbnVsbGFibGU6IHRydWUgfSlcclxuICAgIHN0YWRpdW06IHN0cmluZztcclxuXHJcbiAgICBARmllbGQoKVxyXG4gICAgcG9zdGVhbTogc3RyaW5nO1xyXG5cclxuICAgIEBGaWVsZCh7IG51bGxhYmxlOiB0cnVlIH0pXHJcbiAgICBob21lU2hvcnQ6IHN0cmluZ1xyXG5cclxuICAgIEBGaWVsZCh7IG51bGxhYmxlOiB0cnVlIH0pXHJcbiAgICBhd2F5U2hvcnQ6IHN0cmluZ1xyXG5cclxuICAgIEBGaWVsZCh0eXBlID0+IFtBZ2dHYW1lU3RhdF0sIHtudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBhZ2dyZWdhdGVkR2FtZVN0YXRzPzogQWdnR2FtZVN0YXRbXVxyXG59IiwiaW1wb3J0IHsgT2JqZWN0VHlwZSwgRmllbGQsIElEIH0gZnJvbSBcInR5cGUtZ3JhcGhxbFwiO1xyXG5cclxuQE9iamVjdFR5cGUoKVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xyXG4gICAgQEZpZWxkKHR5cGUgPT4gSUQpXHJcbiAgICBwbGF5ZXJJZDogc3RyaW5nXHJcblxyXG4gICAgQEZpZWxkKHsgbnVsbGFibGU6IHRydWUgfSlcclxuICAgIGZpcnN0TmFtZTogc3RyaW5nXHJcblxyXG4gICAgQEZpZWxkKHsgbnVsbGFibGU6IHRydWUgfSlcclxuICAgIGxhc3ROYW1lOiBzdHJpbmdcclxuXHJcbiAgICBARmllbGQoeyBudWxsYWJsZTogdHJ1ZSB9KVxyXG4gICAgZnVsbE5hbWU6IHN0cmluZ1xyXG5cclxuICAgIEBGaWVsZCh7IG51bGxhYmxlOiB0cnVlIH0pXHJcbiAgICBhZ2U6IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7IG51bGxhYmxlOiB0cnVlIH0pXHJcbiAgICBjb2xsZWdlOiBzdHJpbmdcclxuXHJcbiAgICBARmllbGQoeyBudWxsYWJsZTogdHJ1ZSB9KVxyXG4gICAgLy8gaW4gaW5jaGVzXHJcbiAgICBoZWlnaHQ6IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7IG51bGxhYmxlOiB0cnVlIH0pXHJcbiAgICBudW1iZXI6IG51bWJlclxyXG5cclxuICAgIEBGaWVsZCh7IG51bGxhYmxlOiB0cnVlIH0pXHJcbiAgICBwb3NpdGlvbjogc3RyaW5nXHJcblxyXG4gICAgQEZpZWxkKClcclxuICAgIGdzaXNJZDogc3RyaW5nO1xyXG5cclxuICAgIEBGaWVsZCgpXHJcbiAgICBwcm9maWxlSWQ6IHN0cmluZ1xyXG5cclxuICAgIEBGaWVsZCgpXHJcbiAgICBwcm9maWxlVXJsOiBzdHJpbmdcclxuXHJcbiAgICBARmllbGQoKVxyXG4gICAgYmlydGhEYXRlOiBzdHJpbmdcclxuXHJcbiAgICBARmllbGQoeyBudWxsYWJsZTogdHJ1ZSB9KVxyXG4gICAgYmlydGhDaXR5OiBzdHJpbmdcclxuXHJcbiAgICBARmllbGQoeyBudWxsYWJsZTogdHJ1ZSB9KVxyXG4gICAgc3RhdHVzPzogc3RyaW5nXHJcblxyXG4gICAgQEZpZWxkKHsgbnVsbGFibGU6IHRydWUgfSlcclxuICAgIHRlYW06IHN0cmluZ1xyXG5cclxuICAgIEBGaWVsZCh7bnVsbGFibGU6IHRydWV9KVxyXG4gICAgd2VpZ2h0OiBudW1iZXJcclxuXHJcbiAgICBARmllbGQoe251bGxhYmxlOiB0cnVlfSlcclxuICAgIHllYXJzUHJvPzogbnVtYmVyXHJcbn0iLCJpbXBvcnQgeyBBcmdzVHlwZSwgRmllbGQsIEludCwgT2JqZWN0VHlwZSB9IGZyb20gJ3R5cGUtZ3JhcGhxbCc7XHJcbmltcG9ydCBHYW1lRGV0YWlscyBmcm9tICcuL0dhbWUnO1xyXG5cclxuQEFyZ3NUeXBlKClcclxuZXhwb3J0IGNsYXNzIHNlYXJjaFNjaGVkdWxlQXJncyB7XHJcblxyXG4gICAgQEZpZWxkKHsgbnVsbGFibGU6IHRydWUgfSlcclxuICAgIHllYXI/OiBudW1iZXI7XHJcblxyXG4gICAgQEZpZWxkKHsgbnVsbGFibGU6IHRydWUgfSlcclxuICAgIHdlZWs/OiBudW1iZXI7XHJcblxyXG4gICAgQEZpZWxkKHsgbnVsbGFibGU6IHRydWUgfSlcclxuICAgIGhvbWU/OiBzdHJpbmc7XHJcblxyXG4gICAgQEZpZWxkKHsgbnVsbGFibGU6IHRydWUgfSlcclxuICAgIGF3YXk/OiBzdHJpbmc7XHJcblxyXG4gICAgQEZpZWxkKHsgbnVsbGFibGU6IHRydWUgfSlcclxuICAgIHNlYXNvbl90eXBlPzogc3RyaW5nO1xyXG59XHJcblxyXG5AT2JqZWN0VHlwZSgpXHJcbmV4cG9ydCBjbGFzcyBTY2hlZHVsZSB7XHJcbiAgICBARmllbGQoKVxyXG4gICAgZ2FtZWlkOiBzdHJpbmdcclxuXHJcbiAgICBARmllbGQoKVxyXG4gICAgZ3NpczogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKHR5cGUgPT4gR2FtZURldGFpbHMpXHJcbiAgICBnYW1lPzogR2FtZURldGFpbHNcclxuXHJcbiAgICBARmllbGQoKVxyXG4gICAgbW9udGg6IG51bWJlcjtcclxuXHJcbiAgICBARmllbGQoKVxyXG4gICAgcXVhcnRlcjogc3RyaW5nO1xyXG5cclxuICAgIEBGaWVsZCgpXHJcbiAgICB3ZWVrOiBudW1iZXI7XHJcblxyXG4gICAgQEZpZWxkKClcclxuICAgIGdhbWVUeXBlOiBzdHJpbmdcclxuXHJcbiAgICBARmllbGQoKVxyXG4gICAgaG9tZVNob3J0OiBzdHJpbmdcclxuXHJcbiAgICBARmllbGQoKVxyXG4gICAgaG9tZU5hbWU6IHN0cmluZztcclxuXHJcbiAgICBARmllbGQoKVxyXG4gICAgaG9tZVNjb3JlOiBudW1iZXI7XHJcblxyXG4gICAgQEZpZWxkKClcclxuICAgIGF3YXlTaG9ydDogc3RyaW5nO1xyXG5cclxuICAgIEBGaWVsZCgpXHJcbiAgICBhd2F5TmFtZTogc3RyaW5nO1xyXG5cclxuICAgIEBGaWVsZCgpXHJcbiAgICBhd2F5U2NvcmU6IG51bWJlcjtcclxuXHJcbiAgICBARmllbGQoKVxyXG4gICAgdGltZTogc3RyaW5nXHJcblxyXG4gICAgQEZpZWxkKClcclxuICAgIGRheTogbnVtYmVyXHJcblxyXG4gICAgQEZpZWxkKClcclxuICAgIHdkYXk6IHN0cmluZ1xyXG5cclxuICAgIEBGaWVsZCgpXHJcbiAgICB5ZWFyOiBudW1iZXJcclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJheGlvc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjaGVlcmlvXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzLWV4dHJhXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImdyYXBocWwteW9nYVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWZsZWN0LW1ldGFkYXRhXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInR5cGUtZ3JhcGhxbFwiKTsiXSwic291cmNlUm9vdCI6IiJ9