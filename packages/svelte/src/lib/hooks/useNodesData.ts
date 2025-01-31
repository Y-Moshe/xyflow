import { derived, type Readable } from 'svelte/store';

import type { Node } from '$lib/types';
import { useStore } from '$lib/store';

function areNodesDataEqual(a: any[], b: any[]) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i].data !== b[i].data) {
      return false;
    }
  }

  return true;
}

/**
 * Hook for receiving data of one or multiple nodes
 *
 * @public
 * @param nodeId - The id (or ids) of the node to get the data from
 * @returns A readable store with an array of data objects
 */
export function useNodesData<NodeType extends Node = Node>(
  nodeId: string
): Readable<Pick<NodeType, 'id' | 'data' | 'type'> | null>;
export function useNodesData<NodeType extends Node = Node>(
  nodeIds: string[]
): Readable<Pick<NodeType, 'id' | 'data' | 'type'>[]>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useNodesData(nodeIds: any): any {
  const { nodes, nodeLookup } = useStore();
  let prevNodesData: any = [];

  return derived([nodes, nodeLookup], ([, nodeLookup], set) => {
    const nextNodesData = [];
    const isArrayOfIds = Array.isArray(nodeIds);
    const _nodeIds = isArrayOfIds ? nodeIds : [nodeIds];

    for (const nodeId of _nodeIds) {
      const node = nodeLookup.get(nodeId);
      if (node) {
        nextNodesData.push({
          id: node.id,
          type: node.type,
          data: node.data
        });
      }
    }

    if (!areNodesDataEqual(nextNodesData, prevNodesData)) {
      prevNodesData = nextNodesData;
      set(isArrayOfIds ? nextNodesData : nextNodesData[0] ?? null);
    }
  });
}
