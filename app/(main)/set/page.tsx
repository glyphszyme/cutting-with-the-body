"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Config {
    px_per_cm_w: number;
    px_per_cm_h: number;
    font_size_ratio: number;
    max_grid_width: number;
    max_grid_height: number;
}

const DEFAULT_CONFIG: Config = {
    px_per_cm_w: 21.20269841,
    px_per_cm_h: 21.32155439,
    font_size_ratio: 0.8,
    max_grid_width: 25,
    max_grid_height: 84,
};

const LIMITS = {
    px_per_cm_w:      { min: 0.01, max: 200 },
    px_per_cm_h:      { min: 0.01, max: 200 },
    font_size_ratio:  { min: 0.01, max: 1 },
    max_grid_width:   { min: 1,    max: 200 },
    max_grid_height:  { min: 1,    max: 500 },
};

type ErrorMap = Partial<Record<keyof Config, string>>;

function validate(config: Config): ErrorMap {
    const errors: ErrorMap = {};

    (Object.keys(LIMITS) as (keyof Config)[]).forEach(key => {
        const val = config[key];
        if (isNaN(val) || val === null || val === undefined) {
            errors[key] = '숫자를 입력해주세요.';
        } else if (val < LIMITS[key].min || val > LIMITS[key].max) {
            errors[key] = `${LIMITS[key].min} ~ ${LIMITS[key].max} 범위여야 합니다.`;
        }
    });

    return errors;
}

export default function SetPage() {
    const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
    const [errors, setErrors] = useState<ErrorMap>({});
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            const { data } = await supabase
                .from('config')
                .select('*')
                .eq('id', 1)
                .single();
            if (data) setConfig(data);
        };
        fetchConfig();
    }, []);

    const handleChange = (key: keyof Config, raw: string) => {
        const isInt = key === 'max_grid_width' || key === 'max_grid_height';
        const value = isInt ? parseInt(raw) : parseFloat(raw);
        const next = { ...config, [key]: value };
        setConfig(next);
        setErrors(validate(next));
        setSaved(false);
    };

    const handleSyncH = () => {
        const next = { ...config, px_per_cm_h: config.px_per_cm_w };
        setConfig(next);
        setErrors(validate(next));
        setSaved(false);
    };

    const handleSave = async () => {
        const errs = validate(config);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        const { error } = await supabase
            .from('config')
            .upsert({ id: 1, ...config, updated_at: new Date().toISOString() }, { onConflict: 'id' });

        if (!error) {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    const sectionStyle: React.CSSProperties = {
        marginBottom: '32px',
    };

    const labelStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        marginBottom: '16px',
    };

    const inputStyle: React.CSSProperties = {
        fontFamily: 'inherit',
        fontSize: 'var(--font-size-large)',
        background: 'none',
        border: '1px solid var(--color-text)',
        color: 'var(--color-text)',
        padding: '8px 12px',
        width: '100%',
        boxSizing: 'border-box',
    };

    const errorStyle: React.CSSProperties = {
        color: 'red',
        fontSize: 'var(--font-size-small)',
    };

    const syncBtnStyle: React.CSSProperties = {
        fontFamily: 'inherit',
        fontSize: 'var(--font-size-small)',
        background: 'none',
        border: '1px solid var(--color-text)',
        color: 'var(--color-text)',
        padding: '4px 10px',
        cursor: 'pointer',
        alignSelf: 'flex-start',
    };

    return (
        <div className="container">
            <main>
                <div className="step-header">
                    <div className="text">설정</div>
                </div>

                <div className="step-main" style={{ overflowY: 'auto' }}>

                    {/* 축척 */}
                    <div style={sectionStyle}>
                        <div className="text" style={{ marginBottom: '12px' }}>축척</div>

                        <label style={labelStyle}>
                            <span className="text">가로 비율</span>
                            <input
                                type="number"
                                step="0.01"
                                style={inputStyle}
                                value={isNaN(config.px_per_cm_w) ? '' : config.px_per_cm_w}
                                onChange={e => handleChange('px_per_cm_w', e.target.value)}
                            />
                            {errors.px_per_cm_w && <span style={errorStyle}>{errors.px_per_cm_w}</span>}
                        </label>

                        <label style={labelStyle}>
                            <span className="text">세로 비율</span>
                            <input
                                type="number"
                                step="0.01"
                                style={inputStyle}
                                value={isNaN(config.px_per_cm_h) ? '' : config.px_per_cm_h}
                                onChange={e => handleChange('px_per_cm_h', e.target.value)}
                            />
                            <button style={syncBtnStyle} onClick={handleSyncH}>
                                가로 비율과 동일하게 설정
                            </button>
                            {errors.px_per_cm_h && <span style={errorStyle}>{errors.px_per_cm_h}</span>}
                        </label>
                    </div>

                    {/* 글자 비율 */}
                    <div style={sectionStyle}>
                        <div className="text" style={{ marginBottom: '12px' }}>글자 비율</div>

                        <label style={labelStyle}>
                            <span className="text">{isNaN(config.font_size_ratio) ? '-' : config.font_size_ratio}</span>
                            <input
                                type="range"
                                min={LIMITS.font_size_ratio.min}
                                max={LIMITS.font_size_ratio.max}
                                step="0.01"
                                style={{ width: '100%' }}
                                value={isNaN(config.font_size_ratio) ? 0.8 : config.font_size_ratio}
                                onChange={e => handleChange('font_size_ratio', e.target.value)}
                            />
                            <input
                                type="number"
                                step="0.01"
                                style={inputStyle}
                                value={isNaN(config.font_size_ratio) ? '' : config.font_size_ratio}
                                onChange={e => handleChange('font_size_ratio', e.target.value)}
                            />
                            {errors.font_size_ratio && <span style={errorStyle}>{errors.font_size_ratio}</span>}
                        </label>
                    </div>

                    {/* 최대 개수 */}
                    <div style={sectionStyle}>
                        <div className="text" style={{ marginBottom: '12px' }}>최대 개수</div>

                        <label style={labelStyle}>
                            <span className="text">가로 최대 개수</span>
                            <input
                                type="number"
                                min={LIMITS.max_grid_width.min}
                                max={LIMITS.max_grid_width.max}
                                step="1"
                                style={inputStyle}
                                value={isNaN(config.max_grid_width) ? '' : config.max_grid_width}
                                onChange={e => handleChange('max_grid_width', e.target.value)}
                            />
                            {errors.max_grid_width && <span style={errorStyle}>{errors.max_grid_width}</span>}
                        </label>

                        <label style={labelStyle}>
                            <span className="text">세로 최대 개수</span>
                            <input
                                type="number"
                                min={LIMITS.max_grid_height.min}
                                max={LIMITS.max_grid_height.max}
                                step="1"
                                style={inputStyle}
                                value={isNaN(config.max_grid_height) ? '' : config.max_grid_height}
                                onChange={e => handleChange('max_grid_height', e.target.value)}
                            />
                            {errors.max_grid_height && <span style={errorStyle}>{errors.max_grid_height}</span>}
                        </label>
                    </div>

                </div>

                <div className="step-footer">
                    <button
                        onClick={handleSave}
                        className="text"
                        style={{
                            background: Object.keys(errors).length > 0 ? 'gray' : 'var(--color-text)',
                            color: 'var(--color-bg)',
                            border: 'none',
                            padding: '12px 24px',
                            cursor: Object.keys(errors).length > 0 ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                            fontSize: 'var(--font-size-large)',
                            width: '100%',
                        }}
                    >
                        {saved ? '저장됨' : Object.keys(errors).length > 0 ? '입력값을 확인해주세요' : '저장'}
                    </button>
                </div>
            </main>
        </div>
    );
}
