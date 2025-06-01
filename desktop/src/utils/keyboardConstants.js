/**
 * 键盘常量定义文件
 * 统一管理全局键盘监听中使用的键名和虚拟键码
 */

// Ctrl 键的各种可能名称（不同系统/库可能有不同命名）
const CTRL_KEYS = {
    LEFT_CTRL: 'LEFT CTRL',
    RIGHT_CTRL: 'RIGHT CTRL',
    CTRL: 'CTRL',
    LCONTROL: 'LCONTROL',
    RCONTROL: 'RCONTROL',
    CONTROL_L: 'Control_L',
    CONTROL_R: 'Control_R'
};

// 字母键
const LETTER_KEYS = {
    C: 'C',
    V: 'V',
    A: 'A',
    X: 'X',
    Z: 'Z',
    Y: 'Y'
};

// 功能键
const FUNCTION_KEYS = {
    F1: 'F1',
    F2: 'F2',
    F3: 'F3',
    F4: 'F4',
    F5: 'F5',
    F6: 'F6',
    F7: 'F7',
    F8: 'F8',
    F9: 'F9',
    F10: 'F10',
    F11: 'F11',
    F12: 'F12'
};

// 修饰键
const MODIFIER_KEYS = {
    ...CTRL_KEYS,
    LEFT_SHIFT: 'LEFT SHIFT',
    RIGHT_SHIFT: 'RIGHT SHIFT',
    SHIFT: 'SHIFT',
    LEFT_ALT: 'LEFT ALT',
    RIGHT_ALT: 'RIGHT ALT',
    ALT: 'ALT',
    LEFT_WIN: 'LEFT WIN',
    RIGHT_WIN: 'RIGHT WIN',
    WIN: 'WIN'
};

// 虚拟键码映射（Windows）
const VIRTUAL_KEY_CODES = {
    CTRL_LEFT: 162,
    CTRL_RIGHT: 163,
    SHIFT_LEFT: 160,
    SHIFT_RIGHT: 161,
    ALT_LEFT: 164,
    ALT_RIGHT: 165,
    WIN_LEFT: 91,
    WIN_RIGHT: 92,
    C: 67,
    V: 86,
    A: 65,
    X: 88,
    Z: 90,
    Y: 89
};

// 检查是否为 Ctrl 键的函数
function isCtrlKey(keyName, vKeyCode) {
    // 通过键名检查
    const ctrlKeyNames = Object.values(CTRL_KEYS);
    if (ctrlKeyNames.includes(keyName)) {
        return true;
    }
    
    // 通过虚拟键码检查（更可靠）
    if (vKeyCode === VIRTUAL_KEY_CODES.CTRL_LEFT || vKeyCode === VIRTUAL_KEY_CODES.CTRL_RIGHT) {
        return true;
    }
    
    return false;
}

// 检查是否为 Shift 键的函数
function isShiftKey(keyName, vKeyCode) {
    return keyName === MODIFIER_KEYS.LEFT_SHIFT || 
           keyName === MODIFIER_KEYS.RIGHT_SHIFT ||
           keyName === MODIFIER_KEYS.SHIFT ||
           vKeyCode === VIRTUAL_KEY_CODES.SHIFT_LEFT ||
           vKeyCode === VIRTUAL_KEY_CODES.SHIFT_RIGHT;
}

// 检查是否为 Alt 键的函数
function isAltKey(keyName, vKeyCode) {
    return keyName === MODIFIER_KEYS.LEFT_ALT || 
           keyName === MODIFIER_KEYS.RIGHT_ALT ||
           keyName === MODIFIER_KEYS.ALT ||
           vKeyCode === VIRTUAL_KEY_CODES.ALT_LEFT ||
           vKeyCode === VIRTUAL_KEY_CODES.ALT_RIGHT;
}

// 获取键的友好名称
function getKeyFriendlyName(keyName, vKeyCode) {
    if (isCtrlKey(keyName, vKeyCode)) return 'Ctrl';
    if (isShiftKey(keyName, vKeyCode)) return 'Shift';
    if (isAltKey(keyName, vKeyCode)) return 'Alt';
    return keyName;
}

// 常用快捷键组合检查
function isCtrlC(keyName, vKeyCode, ctrlPressed) {
    return (keyName === LETTER_KEYS.C || vKeyCode === VIRTUAL_KEY_CODES.C) && ctrlPressed;
}

function isCtrlV(keyName, vKeyCode, ctrlPressed) {
    return (keyName === LETTER_KEYS.V || vKeyCode === VIRTUAL_KEY_CODES.V) && ctrlPressed;
}

function isCtrlA(keyName, vKeyCode, ctrlPressed) {
    return (keyName === LETTER_KEYS.A || vKeyCode === VIRTUAL_KEY_CODES.A) && ctrlPressed;
}

function isCtrlX(keyName, vKeyCode, ctrlPressed) {
    return (keyName === LETTER_KEYS.X || vKeyCode === VIRTUAL_KEY_CODES.X) && ctrlPressed;
}

function isCtrlZ(keyName, vKeyCode, ctrlPressed) {
    return (keyName === LETTER_KEYS.Z || vKeyCode === VIRTUAL_KEY_CODES.Z) && ctrlPressed;
}

module.exports = {
    // 常量导出
    CTRL_KEYS,
    LETTER_KEYS,
    FUNCTION_KEYS,
    MODIFIER_KEYS,
    VIRTUAL_KEY_CODES,
    
    // 检查函数导出
    isCtrlKey,
    isShiftKey,
    isAltKey,
    getKeyFriendlyName,
    
    // 快捷键组合检查
    isCtrlC,
    isCtrlV,
    isCtrlA,
    isCtrlX,
    isCtrlZ
}; 