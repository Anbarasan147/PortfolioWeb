package PortfolioWeb;

import java.util.HashMap;

class TwoSum {
    public int[] twosum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int Com = target - nums[i];
            if (map.containsKey(Com)) {
                return new int[] { map.get(Com), i };
            }
            map.put(nums[i], i);
        }
        return new int[] { -1, -1 };
    }
}